package com.oved.petsadoption.bl.services.impl;

import com.oved.petsadoption.api.enums.AdoptionRequestStatus;
import com.oved.petsadoption.api.enums.AnimalStatus;
import com.oved.petsadoption.api.models.animal.AnimalForInsertApi;
import com.oved.petsadoption.api.models.animal.AnimalForUpdateApi;
import com.oved.petsadoption.bl.utils.SingletonLockUtils;
import com.oved.petsadoption.bl.utils.StrUtils;
import com.oved.petsadoption.dal.bl.specification.AnimalSpecificationsBuilder;
import com.oved.petsadoption.conf.appconfig.exception.ApiException;
import com.oved.petsadoption.bl.services.IAdoptionRequestService;
import com.oved.petsadoption.bl.services.IAnimalService;
import com.oved.petsadoption.bl.services.IUserService;
import com.oved.petsadoption.dal.entities.AdoptionRequestEntity;
import com.oved.petsadoption.dal.entities.AnimalEntity;
import com.oved.petsadoption.dal.entities.BreedEntity;
import com.oved.petsadoption.dal.entities.CategoryEntity;
import com.oved.petsadoption.dal.repository.AnimalRepository;
import com.oved.petsadoption.dal.repository.BreedRepository;
import com.oved.petsadoption.dal.repository.CategoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AnimalServiceImpl implements IAnimalService {
    @Autowired
    private AnimalRepository animalRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BreedRepository breedRepository;
    @Autowired
    private IUserService userService;
    @Autowired
    private IAdoptionRequestService adoptionRequestService;

    private final List<AnimalEntity> randomAnimals = new ArrayList<>();
    private final AnimalSpecificationsBuilder builder = new AnimalSpecificationsBuilder();

    private static final Lock lock = SingletonLockUtils.getInstance().getLock();
    private static final int RANDOM_ANIMALS_SIZE = 9;
    private static final String REGEX_FOR_FILTER_PARAM = "(\\w+?)(:|<|>)(\\w+?),";
    private static final Pattern PATTERN_FILTER = Pattern.compile(REGEX_FOR_FILTER_PARAM);
    private static final String ERR_ANIMAL_JSON_NULL = "ERROR! the animal json must be not null.";
    private static final String ERR_CATEGORY_ID_IS_NULL = "ERROR! category id is null.";
    private static final String ERR_BREED_NAME_IS_NULL = "ERROR! breed name is null.";
    private static final String SPACE_STR = " ";


    @Override
    public AnimalEntity addAnimal(AnimalForInsertApi newAnimal, Long userId, Long categoryId) {
        validateNewAnimalForInsert(newAnimal);

        log.info("starting to create a new animal...");
        AnimalEntity animal = createAnimalEntity(newAnimal, userId, categoryId);
        log.info(String.format("animal with id %s add to the system.", animal.getId()));

        return animalRepository.save(animal);
    }

    @Override
    public AnimalEntity getAnimalById(Long animalId) {
        if (animalId == null) {
            log.error("ERROR! animal id is null in getAnimalById");
            lock.unlock();
            throw new ApiException("ERROR! the animal id is null.", HttpStatus.BAD_REQUEST);
        }

        if (!animalRepository.existsById(animalId)) {
            String notExist = String.format("ERROR! animal with id : %s is not exist.", animalId);
            log.error(notExist);
            lock.unlock();
            throw new ApiException(notExist, HttpStatus.BAD_REQUEST);
        }

        AnimalEntity animal = animalRepository.getById(animalId);
        if (animal.getStatus() == AnimalStatus.DELETED) {
            String deletedAnimal = String.format("ERROR! animal with id: %s is deleted.", animalId);
            log.error(deletedAnimal);
            lock.unlock();
            throw new ApiException(deletedAnimal, HttpStatus.BAD_REQUEST);
        }

        log.info(String.format("animal with id: %s id loaded.", animalId));

        return animal;
    }

    @Override
    public Page<AnimalEntity> getAnimalByCategory(Long categoryId, int pageNumber, int pageSize) {
        CategoryEntity category = getCategoryById(categoryId);
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        log.info(String.format("starting load animals with category: %s and status %s...", category.getCategoryName(),
                AnimalStatus.WAITING_FOR_ADOPT));
        Page<AnimalEntity> animalsByCategory = animalRepository.getAnimalsByCategoryAndStatus(category,
                AnimalStatus.WAITING_FOR_ADOPT, pageRequest);
        log.info(String.format("finished loaded animals with category: %s and status %s. the size is: %s",
                category.getCategoryName(), AnimalStatus.WAITING_FOR_ADOPT, animalsByCategory.getNumberOfElements()));

        return animalsByCategory;
    }

    @Override
    public List<AnimalEntity> getAnimalsByOwner(Long userId) {
        log.info(String.format("starting load animals for owner with id: %s...", userId));
        List<AnimalEntity> animals = animalRepository.getAnimalByOwner(userService.getUserById(userId)).stream()
                .filter(animal -> animal.getStatus() != AnimalStatus.DELETED)
                .collect(Collectors.toList());
        log.info(String.format("finished loaded animals for owner with id: %s. the size is: %s", userId, animals.size()));

        return animals;
    }

    @Transactional
    @Override
    public void updateAnimal(AnimalForUpdateApi animalApi, Long animalId) {
        if (animalApi == null) {
            log.error("ERROR! the animal object is null in updateAnimal");
            throw new ApiException(ERR_ANIMAL_JSON_NULL, HttpStatus.BAD_REQUEST);
        }

        AnimalEntity animalToUpdate = getAnimalById(animalId);
        if (animalToUpdate.getStatus() != AnimalStatus.WAITING_FOR_ADOPT) {
            String cannotUpdateErr = String.format("ERROR! cannot update animal with status: %s , animal id: %s",
                    animalToUpdate.getStatus(), animalId);
            log.error(cannotUpdateErr);
            throw new ApiException(cannotUpdateErr, HttpStatus.BAD_REQUEST);
        }

        if(animalApi.getCategory() != null) {
            CategoryEntity categoryFromDb = getCategoryById(animalApi.getCategory().getId());
            checkIfCategoryExist(categoryFromDb, animalApi.getCategory());
        }

        log.info(String.format("starting to update animal with id: %s", animalId));
        editAnimalForUpdate(animalApi, animalToUpdate);
        log.info(String.format("finished to update animal with id: %s", animalId));
        animalRepository.save(animalToUpdate);
    }

    @Override
    public List<AnimalEntity> getRandomList() {
        log.info(String.format("starting to load animals with status %s for randomList.", AnimalStatus.WAITING_FOR_ADOPT));
        List<AnimalEntity> animals = animalRepository.getAnimalsByStatus(AnimalStatus.WAITING_FOR_ADOPT);
        int sizeOfAnimalsList = animals.size();
        log.info(String.format("finished to loaded animals with status %s for randomList. the size is: %s",
                AnimalStatus.WAITING_FOR_ADOPT, sizeOfAnimalsList));

        if (sizeOfAnimalsList < RANDOM_ANIMALS_SIZE) {
            return animals;
        }

        randomAnimals.clear();
        log.info("start to create a random list of animals.");
        for (int i = 0; i < RANDOM_ANIMALS_SIZE; i++) {
            int randomNumber = getPositiveRandomNumber(animals.size() - 1);
            randomAnimals.add(animals.get(randomNumber));
            animals.remove(randomNumber);
        }
        log.info("finished to created a random list of animals.");

        return randomAnimals;
    }

    @Override
    public List<CategoryEntity> getAllCategories() {
        log.info("starting to load all categories");
        List<CategoryEntity> allCategories = categoryRepository.findAll();
        log.info(String.format("finished to loaded all categories. the size is: %s", allCategories.size()));

        return allCategories;
    }

    @Override
    public void deleteAnimal(Long animalId) {
        lock.lock();
        AnimalEntity animal = getAnimalById(animalId);

        log.info(String.format("starting to delete animal with id: %s ...", animalId));
        if(animal.getStatus() == AnimalStatus.WAITING_FOR_ADOPT) {
            declineAllAdoptionRequests(animalId);
            log.info(String.format("decline all the adoption requests for animal with id: %s", animalId));
        }

        animal.setStatus(AnimalStatus.DELETED);
        animalRepository.save(animal);
        lock.unlock();

        log.info(String.format("animal with id: %s deleted from the system successfully.", animalId));
    }

    @Override
    public Page<AnimalEntity> getAnimalsByFilter(Long categoryId, String search, int pageNumber, int pageSize) {
        if (search == null) {
            log.error("ERROR! the object of search filter is null in getAnimalsByFilter");
            throw new ApiException("ERROR! the search filter is null.", HttpStatus.BAD_REQUEST);
        }

        builder.clear();
        Matcher matcher = PATTERN_FILTER.matcher(search + ",");
        while (matcher.find()) {
            if(matcher.group(1).equals("breed")) {
                builder.with(matcher.group(1), matcher.group(2),
                        getBreedEntityByName(matcher.group(3).replace("_", " ")));
            } else {
                builder.with(matcher.group(1), matcher.group(2), matcher.group(3));
            }
        }

        builder.with("status", ":", AnimalStatus.WAITING_FOR_ADOPT);
        builder.with("category", ":", getCategoryById(categoryId));
        Specification<AnimalEntity> spec = builder.build();
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        log.info(String.format("starting to load animals with filter: %s", builder));
        Page<AnimalEntity> animalsByFilter = animalRepository.findAll(spec, pageRequest);
        log.info(String.format("finished to loaded animals with filter: %s. the size is: %s", builder,
                animalsByFilter.getNumberOfElements()));

        return animalsByFilter;
    }


    @Override
    public List<BreedEntity> getBreedsByCategory(Long categoryId) {
        CategoryEntity category = getCategoryById(categoryId);
        List<BreedEntity> breedsByCategory = breedRepository.getBreedEntitiesByCategory(category);
        breedsByCategory.add(new BreedEntity("Other", category));
        return breedsByCategory;
    }

    private AnimalEntity createAnimalEntity(AnimalForInsertApi newAnimal, Long userId, Long categoryId) {

        return AnimalEntity.builder()
                .name(newAnimal.getName())
                .age(newAnimal.getAge())
                .owner(userService.getUserById(userId))
                .category(getCategoryById(categoryId))
                .breed(getBreedEntityByName(newAnimal.getBreed()))
                .sex(newAnimal.getSex())
                .color(newAnimal.getColor())
                .size(newAnimal.getSize())
                .description(newAnimal.getDescription())
                .status(AnimalStatus.WAITING_FOR_ADOPT)
                .build();
    }

    private BreedEntity getBreedEntityByName(String breedName) {
        if(breedName == null) {
            log.error(ERR_CATEGORY_ID_IS_NULL);
            throw new ApiException(ERR_BREED_NAME_IS_NULL, HttpStatus.BAD_REQUEST);
        }
        String[] breed = breedName.split(SPACE_STR);
        StringBuilder validBreedName = new StringBuilder(Character.toUpperCase(breed[0].charAt(0)) +
                                                            breed[0].substring(1).toLowerCase());

        for(int i = 1; i < breed.length; i++) {
            validBreedName.append(SPACE_STR).append(Character.toUpperCase(breed[i].charAt(0)))
                                      .append(breed[i].substring(1).toLowerCase());
        }

        if(!breedRepository.existsById(validBreedName.toString())) {
            String notExist = "ERROR! breed name: " + breedName + " is not exist.";
            log.info(notExist);
            throw new ApiException(notExist, HttpStatus.BAD_REQUEST);
        }

        log.info("breed name + " + breedName + " is loaded.");

        return breedRepository.getById(validBreedName.toString());
    }

    private int getPositiveRandomNumber(int maxRange) {
        return (int) (Math.random() * maxRange);
    }

    private CategoryEntity getCategoryById(Long categoryId) {
        if (categoryId == null) {
            log.error(ERR_CATEGORY_ID_IS_NULL);
            throw new ApiException(ERR_CATEGORY_ID_IS_NULL, HttpStatus.BAD_REQUEST);
        }

        if(!categoryRepository.existsById(categoryId)) {
            String notExist = String.format("ERROR! category id: %s is not exist.", categoryId);
            log.info(notExist);
            throw new ApiException(notExist, HttpStatus.BAD_REQUEST);
        }

        CategoryEntity category = categoryRepository.getById(categoryId);
        log.info(String.format("category with id: %s id loaded.", categoryId));

        return category;
    }

    private void editAnimalForUpdate(AnimalForUpdateApi animalApi, AnimalEntity animalToUpdate) {
        animalToUpdate.setCategory(animalApi.getCategory() == null ? animalToUpdate.getCategory() : animalApi.getCategory());
        animalToUpdate.setName(animalApi.getName() == null ? animalToUpdate.getName() : animalApi.getName());
        animalToUpdate.setAge(animalApi.getAge() == null ? animalToUpdate.getAge() : animalApi.getAge());
        animalToUpdate.setSex(animalApi.getSex() == null ? animalToUpdate.getSex() : animalApi.getSex());
        animalToUpdate.setBreed(animalApi.getBreed() == null ? breedRepository.getById(animalToUpdate.getBreed()) :
                getBreedEntityByName(animalApi.getBreed()));
        animalToUpdate.setColor(animalApi.getColor() == null ? animalToUpdate.getColor() : animalApi.getColor());
        animalToUpdate.setSize(animalApi.getSize() == null ? animalToUpdate.getSize() : animalApi.getSize());
        animalToUpdate.setDescription(animalApi.getDescription() == null ? animalToUpdate.getDescription() :
                animalApi.getDescription());
    }

    private void checkIfCategoryExist(CategoryEntity categoryFromDb, CategoryEntity categoryToUpdate) {
        log.info(String.format("start to check if the object of category to update with id: %s in updateAnimal " +
                        "exist in the DB.", categoryToUpdate.getId()));

        if (!categoryFromDb.equals(categoryToUpdate)) {
            String categoryNotExist = String.format("ERROR! category id: %s, with category name: %s  is not exist.",
                    categoryToUpdate.getId(), categoryToUpdate.getCategoryName());
            log.error(categoryNotExist);
            throw new ApiException(categoryNotExist, HttpStatus.BAD_REQUEST);
        }

        log.info(String.format("the category to update with id: %s  in updateAnimal is exist in the DB.",
                categoryToUpdate.getId()));
    }

    private void declineAllAdoptionRequests(Long animalId) {
        log.info(String.format("staring load all adoption request for animal id: %s in deleteAnimal", animalId));
        List<AdoptionRequestEntity> adoptionRequests = adoptionRequestService.getRequestsByAnimal(animalId);
        log.info(String.format("finished loaded all adoption requests for animal id: %d in deleteAnimal and " +
                "staring to decline all the requests.", animalId));
        for (AdoptionRequestEntity adoptionRequest : adoptionRequests) {
            adoptionRequest.setStatus(AdoptionRequestStatus.DECLINE);
        }
    }

    private void validateNewAnimalForInsert(AnimalForInsertApi newAnimal) {
        if (newAnimal == null) {
            log.error("ERROR! the animal object is null in addAnimal");
            throw new ApiException(ERR_ANIMAL_JSON_NULL, HttpStatus.BAD_REQUEST);
        }

        if(StrUtils.isBlank(newAnimal.getName()) || StrUtils.isBlank(newAnimal.getAge().toString()) ||
                StrUtils.isBlank(newAnimal.getColor()) || StrUtils.isBlank(newAnimal.getBreed()) ||
                StrUtils.isBlank(newAnimal.getDescription()) || StrUtils.isBlank(newAnimal.getSex()) ||
                StrUtils.isBlank(newAnimal.getSize())) {
            String nullErr = String.format("In addAnimal there is null in the fields of new animal object: %s ", newAnimal);
            log.error(nullErr);
            throw new ApiException(nullErr, HttpStatus.BAD_REQUEST);
        }
    }
}
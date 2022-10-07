package com.oved.petsadoption.bl.services.impl;

import com.oved.petsadoption.api.enums.AdoptionRequestStatus;
import com.oved.petsadoption.api.enums.AnimalStatus;
import com.oved.petsadoption.bl.utils.SingletonLockUtils;
import com.oved.petsadoption.conf.appconfig.exception.ApiException;
import com.oved.petsadoption.bl.services.IAdoptionRequestService;
import com.oved.petsadoption.bl.services.IAnimalService;
import com.oved.petsadoption.bl.services.IUserService;
import com.oved.petsadoption.dal.entities.AdoptionRequestEntity;
import com.oved.petsadoption.dal.entities.AnimalEntity;
import com.oved.petsadoption.dal.entities.UserEntity;
import com.oved.petsadoption.dal.repository.AdoptionRequestRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AdoptionRequestServiceImpl implements IAdoptionRequestService {
    @Autowired
    private AdoptionRequestRepository adoptionRequestRepository;
    @Autowired
    private IAnimalService animalService;
    @Autowired
    private IUserService userService;

    private static final Lock lock = SingletonLockUtils.getInstance().getLock();
    private static final String ERR_REQUEST_ID_IS_NULL = "ERROR! the request id is null.";

    @Override
    public void addRequest(Long userId, Long animalId) {
        UserEntity requestorUser = userService.getUserById(userId);
        lock.lock();
        AnimalEntity animal = animalService.getAnimalById(animalId);

        checkIfAnimalAvailableToAdoption(animal);
        checkIfUserIsTheOwner(animal.getOwner().getId(), requestorUser.getId());
        duplicateAdoptionRequestHandler(requestorUser, animal);


        AdoptionRequestEntity newAdoptionRequest = new AdoptionRequestEntity(requestorUser, animal);
        adoptionRequestRepository.save(newAdoptionRequest);
        lock.unlock();

        log.info(String.format("the adoption request saved for user with id: %s send to animal with id: %s, ",
                userId, animalId));
    }

    @Override
    public AdoptionRequestEntity getRequestById(Long requestId) {
        if (requestId == null) {
            log.error(ERR_REQUEST_ID_IS_NULL);
            lock.unlock();
            throw new ApiException(ERR_REQUEST_ID_IS_NULL, HttpStatus.BAD_REQUEST);
        }

        if (!adoptionRequestRepository.existsById(requestId)) {
            String notExist = String.format("ERROR! request id: %s is not exist.", requestId);
            log.error(notExist);
            lock.unlock();
            throw new ApiException(notExist, HttpStatus.BAD_REQUEST);
        }

        log.info(String.format("adoption request with id %s is loaded in getRequestById", requestId));

        return adoptionRequestRepository.getById(requestId);
    }

    @Override
    public List<AdoptionRequestEntity> getRequestsByAnimal(Long animalId) {
        log.info(String.format("starting load Adoption Requests for animal id: %s ...", animalId));

        List<AdoptionRequestEntity> requests = adoptionRequestRepository.getAdoptionRequestByAdoptedAnimal(
                        animalService.getAnimalById(animalId)).stream()
                .filter(request -> request.getStatus() != AdoptionRequestStatus.DECLINE)
                .collect(Collectors.toList());

        log.info(String.format("finished load Adoption Requests for animal id: %s, the size is: %s", animalId,
                requests.size()));

        return requests;
    }

    @Override
    public void setStatus(Long requestId, String newStatus) {
        if (newStatus == null) {
            log.error("ERROR! the new status of the adoption request in setStatus is null.");
            throw new ApiException("ERROR! the new status is null.", HttpStatus.BAD_REQUEST);
        }

        lock.lock();
        AdoptionRequestEntity adoptionRequest = getRequestById(requestId);
        AdoptionRequestStatus newStatusEnum = convertStatusFromStringToEnum(newStatus.toUpperCase().trim());
        AdoptionRequestStatus currentStatus = adoptionRequest.getStatus();
        checkIfCurrentStatusIsDecline(currentStatus);

        if (requestIsApprove(newStatusEnum, currentStatus)) {
            approveRequestHandler(adoptionRequest);
        } else if (isRequestSetStatusFromApprove(currentStatus, newStatusEnum != AdoptionRequestStatus.APPROVE)) {
            adoptionRequest.getAdoptedAnimal().setStatus(AnimalStatus.WAITING_FOR_ADOPT);
            log.info(String.format("animal with id: %s is back to WAITING_FOR_ADOPT status",
                    adoptionRequest.getAdoptedAnimal().getId()));
        }

        adoptionRequest.setStatus(newStatusEnum);
        log.info(String.format("adoption request with id: %s change the status from %s to %s", adoptionRequest.getId(),
                currentStatus, newStatus));
        adoptionRequestRepository.save(adoptionRequest);
        lock.unlock();
    }

    @Override
    public List<AdoptionRequestEntity> getRequestsByRequestorUser(Long requestorUserId) {
        log.info(String.format("starting load Adoption Requests for user id: %s ...", requestorUserId));
        List<AdoptionRequestEntity> requests = adoptionRequestRepository
                .getAdoptionRequestByRequestorUser(userService.getUserById(requestorUserId));

        log.info(String.format("finished load Adoption Requests for animal id: %s, the size is: %s", requestorUserId,
                requests.size()));

        return requests;
    }

    @Override
    public void deleteAdoptionRequest(Long requestId) {
        lock.lock();
        AdoptionRequestEntity adoptionRequest = getRequestById(requestId);

        if (adoptionRequest.getStatus() == AdoptionRequestStatus.APPROVE) {
            String requestIsAppErr = String.format("ERROR! cannot delete adoption request id: %s because the " +
                    "status is approve.", requestId);
            log.error(requestIsAppErr);
            lock.unlock();
            throw new ApiException(requestIsAppErr, HttpStatus.CONFLICT);
        }

        adoptionRequestRepository.delete(adoptionRequest);
        lock.unlock();
        log.info(String.format("adoption request with id: %s is deleted from the system.", requestId));
    }

    private void declineAllRequests(List<AdoptionRequestEntity> requestsList) {
        for (AdoptionRequestEntity adoptionRequest : requestsList) {
            adoptionRequest.setStatus(AdoptionRequestStatus.DECLINE);
            adoptionRequestRepository.save(adoptionRequest);
            log.info(String.format("adoption request with id: %s is decline.", adoptionRequest.getId()));
        }
    }

    private AdoptionRequestStatus convertStatusFromStringToEnum(String newStatus) {
        try {
            return AdoptionRequestStatus.valueOf(newStatus);
        } catch (IllegalArgumentException e) {
            log.error(String.format("ERROR! the new status: %s is not status from the adoption request list", newStatus));
            lock.unlock();
            throw new ApiException("ERROR! the new status is not status from the list", HttpStatus.BAD_REQUEST);
        }
    }

    private void duplicateAdoptionRequestHandler(UserEntity requestorUser, AnimalEntity animal) {
        List<AdoptionRequestEntity> requests = getRequestsByRequestorUser(requestorUser.getId());
        for (AdoptionRequestEntity request : requests) {
            if (request.getAdoptedAnimal().getId() == animal.getId()) {
                if (request.getStatus() != AdoptionRequestStatus.DECLINE) {
                    String duplicateRequestErr = String.format("ERROR! duplicate adoption request by user id: %s for" +
                            " animal id: %s", requestorUser.getId(), animal.getId());
                    log.error(duplicateRequestErr);
                    lock.unlock();
                    throw new ApiException(duplicateRequestErr, HttpStatus.CONFLICT);
                } else {
                    log.info(String.format("deleted adoption request(id: %s) with status DECLINE after user with id: %s send " +
                            "request again for animal with id: %s", request.getId(), requestorUser.getId(), animal.getId()));
                    adoptionRequestRepository.delete(request);
                    break;
                }
            }
        }
    }

    private void checkIfCurrentStatusIsDecline(AdoptionRequestStatus currentStatus) {
        if (currentStatus == AdoptionRequestStatus.DECLINE) {
            String declineStatusErr = "ERROR! the status of the adoption request is Decline - cannot change it back.";
            log.error(declineStatusErr);
            lock.unlock();
            throw new ApiException(declineStatusErr, HttpStatus.BAD_REQUEST);
        }
    }

    private void approveRequestHandler(AdoptionRequestEntity adoptionRequest) {
        AnimalEntity adoptedAnimal = adoptionRequest.getAdoptedAnimal();
        List<AdoptionRequestEntity> requestsList = getRequestsByAnimal(adoptedAnimal.getId());
        requestsList.remove(adoptionRequest);
        declineAllRequests(requestsList);
        adoptedAnimal.setStatus(AnimalStatus.ADOPTED);
        log.info(String.format("animal with id: %s his adopted.", adoptedAnimal.getId()));
    }

    private void checkIfAnimalAvailableToAdoption(AnimalEntity animal) {
        if (animal.getStatus() != AnimalStatus.WAITING_FOR_ADOPT) {
            String animalNotAvailableToAdoption = String.format("ERROR! the animal with id: %s is not available " +
                    "to adoption.", animal.getId());
            log.error(animalNotAvailableToAdoption);
            lock.unlock();
            throw new ApiException(animalNotAvailableToAdoption, HttpStatus.BAD_REQUEST);
        }
    }

    private void checkIfUserIsTheOwner(Long ownerId, Long requestorUserId) {
        if (ownerId.equals(requestorUserId)) {
            String errOwnerSendReq = "ERROR! the owner cannot send adoption request to his animal.";
            log.error(errOwnerSendReq);
            lock.unlock();
            throw new ApiException(errOwnerSendReq, HttpStatus.BAD_REQUEST);
        }
    }

    private boolean isRequestSetStatusFromApprove(AdoptionRequestStatus currentStatus, boolean isNewStatusNotApprove) {
        return currentStatus == AdoptionRequestStatus.APPROVE && isNewStatusNotApprove;
    }

    private boolean requestIsApprove(AdoptionRequestStatus newStatusEnum, AdoptionRequestStatus currentStatus) {
        return currentStatus == AdoptionRequestStatus.PENDING && newStatusEnum == AdoptionRequestStatus.APPROVE;
    }
}

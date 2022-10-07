package com.oved.petsadoption.dal.bl.specification;

import com.oved.petsadoption.dal.entities.AnimalEntity;
import com.oved.petsadoption.dal.entities.BreedEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AnimalSpecificationsBuilder {
    private final List<AnimalSearchCriteria> params = new ArrayList<>();

    public AnimalSpecificationsBuilder with(String key, String operation, Object value) {
        params.add(new AnimalSearchCriteria(key, operation, value));
        return this;
    }

    public Specification<AnimalEntity> build() {
        if (params.size() == 0) {
            return null;
        }

        List<Specification<AnimalEntity>> specs = params.stream()
                .map(AnimalSpecification::new)
                .collect(Collectors.toList());

        Specification<AnimalEntity> result = specs.get(0);

        for (int i = 1; i < params.size(); i++) {
            result = Specification.where(result).and(specs.get(i));
        }

        return result;
    }

    public void clear() {
        params.clear();
    }

    @Override
    public String toString() {
        return params.toString();
    }
}

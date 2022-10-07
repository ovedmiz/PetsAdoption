package com.oved.petsadoption.dal.bl.specification;

import com.oved.petsadoption.dal.entities.AnimalEntity;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

@AllArgsConstructor
public class AnimalSpecification implements Specification<AnimalEntity> {
    private AnimalSearchCriteria criteria;

    private static final String GREATER_THEN = ">";
    private static final String LESS_THEN = "<";
    private static final String EQUAL_TO = ":";

    @Override
    public Predicate toPredicate(Root<AnimalEntity> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
            if (criteria.getOperation().equalsIgnoreCase(GREATER_THEN)) {
                return builder.greaterThanOrEqualTo(root.get(criteria.getKey()), criteria.getValue().toString());
            }
            else if (criteria.getOperation().equalsIgnoreCase(LESS_THEN)) {
                return builder.lessThanOrEqualTo(root.get(criteria.getKey()), criteria.getValue().toString());
            }
            else if (criteria.getOperation().equalsIgnoreCase(EQUAL_TO)) {
                return builder.equal(root.get(criteria.getKey()), criteria.getValue());
            }

            return null;
    }
}

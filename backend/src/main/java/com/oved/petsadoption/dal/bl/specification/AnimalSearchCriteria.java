package com.oved.petsadoption.dal.bl.specification;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnimalSearchCriteria {
    private String key;
    private String operation;
    private Object value;
}

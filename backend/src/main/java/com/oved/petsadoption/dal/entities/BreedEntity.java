package com.oved.petsadoption.dal.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity(name = "breeds")
@Data
@NoArgsConstructor
@Table
@JsonIgnoreProperties({"hibernateLazyInitializer"})
@Builder
@AllArgsConstructor
public class BreedEntity {
    //TODO: Remove Long id
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;

    @Id
    @Column(length = 50)
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private CategoryEntity category;

    //TODO: models of animals in controller... check all methods of animals - want get string of breed
    // TODO: insert and update animal.. , animalDTO
    // TODO: logs
}

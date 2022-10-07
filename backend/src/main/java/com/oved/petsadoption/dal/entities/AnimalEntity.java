package com.oved.petsadoption.dal.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oved.petsadoption.api.enums.AnimalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity(name = "animals")
@Data
@NoArgsConstructor
@Table
@JsonIgnoreProperties({"hibernateLazyInitializer"})
@Builder
@AllArgsConstructor
public class AnimalEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer age;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity owner;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private CategoryEntity category;

    @ManyToOne
    @JoinColumn(name = "breed_id", referencedColumnName = "name")
    private BreedEntity breed;
    private String sex;
    private String color;
    private String size;
    private String description;

    @Enumerated(EnumType.STRING)
    private AnimalStatus status;

    @Lob
    @Column(columnDefinition="LONGBLOB")
    private byte[] image;

    public String getBreed() {
        return breed.getName();
    }
}

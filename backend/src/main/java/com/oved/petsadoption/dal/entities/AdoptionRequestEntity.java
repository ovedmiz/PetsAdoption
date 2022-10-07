package com.oved.petsadoption.dal.entities;

import com.oved.petsadoption.api.enums.AdoptionRequestStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity(name = "Adoption_requests")
@Data
@NoArgsConstructor
@Table
public class AdoptionRequestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity requestorUser;

    @ManyToOne
    @JoinColumn(name = "animal_id", referencedColumnName = "id")
    private AnimalEntity adoptedAnimal;

    @Enumerated(EnumType.STRING)
    private AdoptionRequestStatus status = AdoptionRequestStatus.PENDING;

    public AdoptionRequestEntity(UserEntity requestorUser, AnimalEntity adoptedAnimal) {
        this.requestorUser = requestorUser;
        this.adoptedAnimal = adoptedAnimal;
    }
}

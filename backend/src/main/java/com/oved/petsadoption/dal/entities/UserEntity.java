package com.oved.petsadoption.dal.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.Period;

@Entity(name = "users")
@Data
@NoArgsConstructor
@Table
@JsonIgnoreProperties({"hibernateLazyInitializer"})
@Builder
@AllArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    @Transient
    private Integer age;
    private LocalDate dob;
    private String email;
    private String password;
    private String city;
    private String phone;
    private String resetPasswordToken;

    public Integer getAge() {
        return Period.between(dob, LocalDate.now()).getYears();
    }

}

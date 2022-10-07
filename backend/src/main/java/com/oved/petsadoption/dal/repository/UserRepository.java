package com.oved.petsadoption.dal.repository;

import com.oved.petsadoption.dal.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByEmail(String email);
    UserEntity findUserEntityByEmail(String email);
    Optional<UserEntity> findUserEntityByResetPasswordToken(String resetPasswordToken);
}

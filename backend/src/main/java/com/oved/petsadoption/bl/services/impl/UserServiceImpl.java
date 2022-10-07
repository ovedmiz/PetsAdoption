package com.oved.petsadoption.bl.services.impl;

import com.oved.petsadoption.api.models.ForgotPasswordModel;
import com.oved.petsadoption.api.models.user.UserForInsertApi;
import com.oved.petsadoption.api.models.ResetPasswordModel;
import com.oved.petsadoption.api.models.user.UserForUpdateApi;
import com.oved.petsadoption.bl.utils.SingletonLockUtils;
import com.oved.petsadoption.conf.appconfig.exception.ApiException;
import com.oved.petsadoption.bl.services.IUserService;
import com.oved.petsadoption.bl.utils.StrUtils;
import com.oved.petsadoption.dal.entities.UserEntity;
import com.oved.petsadoption.dal.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.io.UnsupportedEncodingException;
import java.util.concurrent.locks.Lock;

@Slf4j
@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder bcryptEncoder;
    @Autowired
    private SendEmailServiceImpl emailUtils;
    @Value("${spring.mail.username}")
    private String mailAddress;

    private static final Lock lock = SingletonLockUtils.getInstance().getLock();
    private static final int RESET_PASS_TOKEN_LEN = 6;
    private static final String ERR_USER_JSON_IS_NULL = "ERROR! the user json is null.";
    private static final String SUBJECT_MAIL = "Pets Adoption - refresh your password";
    private final static String START_OF_MAIL = "<div dir='ltr' color='black'><p>Hello,</p>"
            + "<p>You have requested to reset your password.</p>"
            + "<p>this is your temporary password:</p><br>"
            + "<p>";
    private final static String END_OF_MAIL = "</p>" +
            "<br><p>Ignore this email if you do remember your password, "
            + "or you have not made the request.</p></div>";

    @Override
    public UserEntity addUser(UserForInsertApi newUser) {
        lock.lock();
        validateNewUserForInsert(newUser);

        log.info(String.format("starting to create a new user with email %s", newUser.getEmail()));
        UserEntity userToSave = UserEntity.builder()
                .firstName(newUser.getFirstName().trim())
                .lastName(newUser.getLastName().trim())
                .email(newUser.getEmail().toLowerCase().trim())
                .password(bcryptEncoder.encode(newUser.getPassword().trim()))
                .dob(newUser.getDob())
                .city(newUser.getCity())
                .phone(newUser.getPhone())
                .build();

        UserEntity newUserEntity = userRepository.save(userToSave);

        log.info(String.format("user with email: %s and id: %s add to the system.", userToSave.getEmail(),
                userToSave.getId()));

        lock.unlock();

        return newUserEntity;
    }

    @Override
    public UserEntity getUserById(Long userId) {
        if (userId == null) {
            log.error("ERROR! user id parameter from getUserById is null.");
            throw new ApiException("ERROR! the user id must be not null.", HttpStatus.BAD_REQUEST);
        }
        if (!userRepository.existsById(userId)) {
            String userNotExistMsg = String.format("ERROR! user with id: %s is not exist.", userId);
            log.error(userNotExistMsg);
            throw new ApiException(userNotExistMsg, HttpStatus.BAD_REQUEST);
        }

        log.info(String.format("user with id %s is loaded in getUserById", userId));

        return userRepository.getById(userId);
    }

    @Transactional
    @Override
    public UserEntity updateUser(UserForUpdateApi user, Long userId) {
        if (user == null) {
            log.error("ERROR! the object of user in updateUser is null.");
            throw new ApiException(ERR_USER_JSON_IS_NULL, HttpStatus.BAD_REQUEST);
        }
        UserEntity userToUpdate = getUserById(userId);

        log.info(String.format("starting update user with id %s", userId));

        userToUpdate.setFirstName(user.getFirstName() == null ? userToUpdate.getFirstName() : user.getFirstName());
        userToUpdate.setLastName(user.getLastName() == null ? userToUpdate.getLastName() : user.getLastName());
        userToUpdate.setDob(user.getDob() == null ? userToUpdate.getDob() : user.getDob());
        userToUpdate.setCity(user.getCity() == null ? userToUpdate.getCity() : user.getCity());
        userToUpdate.setPhone(user.getPhone() == null ? userToUpdate.getPhone() : user.getPhone());

        log.info(String.format("finish update user with id %s", userId));

        return userRepository.save(userToUpdate);
    }

    @Override
    public UserEntity getUserByEmail(String email) {
        if (StrUtils.isBlank(email)) {
            log.error("ERROR! email is null in getUserByEmail.");
            throw new ApiException("ERROR! the email must be not null.", HttpStatus.BAD_REQUEST);
        }

        email = email.toLowerCase().trim();

        if (!userRepository.existsByEmail(email)) {
            log.error(String.format("ERROR! user email: %s is not exist in getUserByEmail.", email));
            throw new ApiException(String.format("ERROR! user email: %s is not exist.", email), HttpStatus.FORBIDDEN);
        }

        log.info(String.format("user with email: %s is loaded in getUserByEmail.", email));

        return userRepository.findUserEntityByEmail(email);
    }

    @Override
    public void setPassword(ResetPasswordModel userPasswordDetails, Long userId) {
        if (userPasswordDetails == null) {
            log.error("ERROR! the object of user in setPassword is null.");
            throw new ApiException(ERR_USER_JSON_IS_NULL, HttpStatus.BAD_REQUEST);
        }

        UserEntity user = getUserById(userId);
        if (!bcryptEncoder.matches(userPasswordDetails.getCurrentPassword().trim(), user.getPassword())) {
            log.error(String.format("ERROR! the old password is not correct in setPassword for user with id: %s", userId));
            throw new ApiException(String.format("ERROR! the old password of user id: %s is not correct.", user.getId()),
                    HttpStatus.BAD_REQUEST);
        }

        saveNewPasswordForUser(user, userPasswordDetails.getNewPassword().trim());
        log.info(String.format("user with id: %s set his password successfully.", userId));
    }

    @Override
    public void ForgotPasswordHandler(ForgotPasswordModel userEmail) {
        if (userEmail == null) {
            log.error("ERROR! the object of userEmail in processForgotPassword is null.");
            throw new ApiException(ERR_USER_JSON_IS_NULL, HttpStatus.BAD_REQUEST);
        }

        String newResetPasswordToken = RandomString.make(RESET_PASS_TOKEN_LEN);
        UserEntity user = getUserByEmail(userEmail.getEmail());
        user.setResetPasswordToken(newResetPasswordToken);
        userRepository.save(user);
        log.info(String.format("generate a reset Password Token: %s for user with id: %s.", newResetPasswordToken, user.getId()));

        try {
            String content = String.format(START_OF_MAIL + "%s" + END_OF_MAIL, newResetPasswordToken);
            emailUtils.sendEmail(mailAddress, "Pets Adoption Support", user.getEmail(), SUBJECT_MAIL, content);
            log.info(String.format("email is send to: %s to reset his password. token = %s", user.getEmail(), newResetPasswordToken));
        } catch (MessagingException | UnsupportedEncodingException e) {
            String errMail = String.format("ERROR! cannot sending mail to: %s", userEmail.getEmail());
            log.error(errMail);
            throw new ApiException(errMail, HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public void resetPassword(ResetPasswordModel userPasswords) {
        if (userPasswords == null) {
            log.error("ERROR! the object of userPasswords in resetPassword is null.");
            throw new ApiException(ERR_USER_JSON_IS_NULL, HttpStatus.BAD_REQUEST);
        }

        UserEntity user = userRepository.findUserEntityByResetPasswordToken(
                userPasswords.getCurrentPassword().trim()).orElse(null);
        if (user == null) {
            String invalidToken = String.format("ERROR! invalid reset-password-token: %s", userPasswords.getCurrentPassword());
            log.error(invalidToken);
            throw new ApiException(invalidToken, HttpStatus.BAD_REQUEST);
        }

        log.info(String.format("user with id: %s is loaded into resetPassword method. " +
                "start to process of save new password.", user.getId()));
        user.setResetPasswordToken(null);
        saveNewPasswordForUser(user, userPasswords.getNewPassword().trim());
        log.info(String.format("user with id: %s is rest his password.", user.getId()));
    }


    private void saveNewPasswordForUser(UserEntity user, String newPassword) {
        user.setPassword(bcryptEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private void validateNewUserForInsert(UserForInsertApi newUser) {
        if (newUser == null) {
            log.error("ERROR! the object of new user in addUser is null.");
            throw new ApiException(ERR_USER_JSON_IS_NULL, HttpStatus.BAD_REQUEST);
        }

        String email = newUser.getEmail();
        if (StrUtils.isBlank(email)) {
            log.error(String.format("ERROR! the email of new user in addUser is null or empty: %s", email));
            throw new ApiException("ERROR! the email must be not null or empty.", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(email.toLowerCase().trim())) {
            log.error(String.format("ERROR! duplicate email: %s", email));
            throw new ApiException("ERROR! duplicate email: " + email, HttpStatus.CONFLICT);
        }

        String password = newUser.getPassword();
        if (StrUtils.isBlank(newUser.getPassword())) {
            log.error(String.format("ERROR! the password of new user in addUser is null or empty: %s", password));
            throw new ApiException("ERROR! the password of user must be not null.", HttpStatus.BAD_REQUEST);
        }

        checkIfOthersFieldsOfNewUserIsNull(newUser);
    }

    private void checkIfOthersFieldsOfNewUserIsNull(UserForInsertApi newUser) {
            if(StrUtils.isBlank(newUser.getFirstName()) || StrUtils.isBlank(newUser.getLastName()) ||
                    StrUtils.isBlank(newUser.getCity()) || StrUtils.isBlank(newUser.getPhone()) || newUser.getDob() == null) {
                String nullErr = String.format("In addUser there is null or empty fields of new user object: %s ", newUser);
                log.error(nullErr);
                throw new ApiException(nullErr, HttpStatus.BAD_REQUEST);
            }
    }
}

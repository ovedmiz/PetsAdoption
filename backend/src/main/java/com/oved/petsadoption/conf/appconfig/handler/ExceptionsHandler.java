package com.oved.petsadoption.conf.appconfig.handler;


import com.oved.petsadoption.conf.appconfig.exception.ApiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ExceptionsHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(value = {ApiException.class})
    protected ResponseEntity<ErrorObject> handleConflict(ApiException ex) {
        ErrorObject errorObject = ErrorObject.builder()
                .errorMessage(ex.getMessage())
                .errorCode(ex.getStatus().value())
                .build();

        return ResponseEntity.status(errorObject.getErrorCode()).body(errorObject);
    }
}

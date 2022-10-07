package com.oved.petsadoption.conf.appconfig.handler;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ErrorObject {
    private String errorMessage;
    private int errorCode;
}
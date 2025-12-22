package com.example.demo.ip.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class IPAssetNotFoundException extends RuntimeException {
    public IPAssetNotFoundException(String message) {
        super(message);
    }

    public IPAssetNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

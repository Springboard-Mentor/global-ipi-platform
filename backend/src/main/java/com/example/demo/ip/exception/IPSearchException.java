package com.example.demo.ip.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class IPSearchException extends RuntimeException {
    public IPSearchException(String message) {
        super(message);
    }

    public IPSearchException(String message, Throwable cause) {
        super(message, cause);
    }
}

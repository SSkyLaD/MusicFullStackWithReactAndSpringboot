package org.example.dbconnectdemo.exception;

public class FingerprintMismatchException extends RuntimeException{
    public FingerprintMismatchException(){
        super("Fingerprint mismatch");
    }
}

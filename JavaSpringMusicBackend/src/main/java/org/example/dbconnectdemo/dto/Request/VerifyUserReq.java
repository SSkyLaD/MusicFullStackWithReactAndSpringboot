package org.example.dbconnectdemo.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;



@Data
@AllArgsConstructor
public class VerifyUserReq {
    private String username;

    private String verificationCode;

    private String deviceFingerPrint;
}

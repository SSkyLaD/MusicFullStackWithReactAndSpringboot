package org.example.dbconnectdemo.service;

import jakarta.mail.MessagingException;
import org.example.dbconnectdemo.dto.Request.LoginReqBody;
import org.example.dbconnectdemo.dto.Request.RegisterReqBody;
import org.example.dbconnectdemo.dto.Request.VerifyUserReq;
import org.example.dbconnectdemo.dto.UserDto;

public interface AuthenticateService {
    void register(RegisterReqBody registerReqBody);
    String login(LoginReqBody loginReqBody);
    void loginV2(LoginReqBody loginReqBody) throws MessagingException;
    String verifyLogin(VerifyUserReq verifyUserReq);
}

package org.example.dbconnectdemo.controller;

import jakarta.mail.Header;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.example.dbconnectdemo.dto.Request.LoginReqBody;
import org.example.dbconnectdemo.dto.Request.RegisterReqBody;
import org.example.dbconnectdemo.dto.Request.VerifyUserReq;
import org.example.dbconnectdemo.dto.Response.BaseResponse;
import org.example.dbconnectdemo.dto.Response.LoginRes;
import org.example.dbconnectdemo.dto.Response.ObjectResponse;
import org.example.dbconnectdemo.exception.InvalidInputException;
import org.example.dbconnectdemo.exception.UsernameAlreadyExistException;
import org.example.dbconnectdemo.service.AuthenticateService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthenticationController {
    private final AuthenticateService authenticateService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterReqBody registerReqBody) {
        try {
            authenticateService.register(registerReqBody);
            return ResponseEntity.status(HttpStatus.CREATED).body(new BaseResponse(201,"Account created successfully!"));
        } catch (InvalidInputException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,e.getMessage()));
        } catch(UsernameAlreadyExistException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new BaseResponse(400,e.getMessage()));
        } catch(Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new BaseResponse(500,"Error occurred!"));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginReqBody loginReqBody){
        try {
            String token = authenticateService.login(loginReqBody);
            LoginRes responseLogin = new LoginRes(token, loginReqBody.getUsername());
            return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse(200,"Login successfully!",responseLogin));
        } catch (InvalidInputException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,e.getMessage()));
        } catch (AuthenticationException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Username or password not correct!"));
        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new BaseResponse(500,"Error occurred!"));
        }
    }

    @PostMapping("/loginV2")
    public ResponseEntity<Object> loginV2(@RequestBody LoginReqBody loginReqBody){
        try {
            authenticateService.loginV2(loginReqBody);
            return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse(200,"OTP send, please verify to login"));
        } catch (InvalidInputException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,e.getMessage()));
        } catch (AuthenticationException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Username or password not correct!"));
        } catch (MessagingException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new BaseResponse(500,"Error occurred when send OTP!"));
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new BaseResponse(500,"Error occurred!"));
        }
    }

    @PostMapping("/loginV2/verification")
    public ResponseEntity<Object> loginVerification(@RequestBody VerifyUserReq verifyUserReq){
        try {
            System.out.println(verifyUserReq.getVerificationCode());
            String token = authenticateService.verifyLogin(verifyUserReq);
            LoginRes responseLogin = new LoginRes(token, verifyUserReq.getUsername());
            return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse(200,"Login successfully!",responseLogin));
        } catch (InvalidInputException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,e.getMessage()));
        } catch (AuthenticationException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Username or password not correct!"));
        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new BaseResponse(500,"Error occurred!"));
        }
    }
}

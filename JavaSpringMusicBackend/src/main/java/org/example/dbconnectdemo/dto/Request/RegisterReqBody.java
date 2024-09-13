package org.example.dbconnectdemo.dto.Request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class RegisterReqBody {
    private String username;
    private String email;
    private String password;
}

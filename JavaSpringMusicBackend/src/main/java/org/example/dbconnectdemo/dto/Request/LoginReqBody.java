package org.example.dbconnectdemo.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class LoginReqBody {
    private String username;
    private String password;
}

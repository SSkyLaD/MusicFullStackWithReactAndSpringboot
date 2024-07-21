package org.example.dbconnectdemo.dto;

import lombok.Data;

@Data
public class ResponseData {
    private String msg;
    private Object data;

    public ResponseData(String msg, Object data) {
        this.msg = msg;
        this.data = data;
    }
}

package org.example.dbconnectdemo.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ObjectResponse extends BaseResponse{
    private Object data;

    public ObjectResponse(int code, String msg, Object data) {
        super(code, msg);
        this.data = data;
    }
}

package org.example.dbconnectdemo.dto.Response;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.example.dbconnectdemo.dto.SongDto;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class ListResponse extends BaseResponse {
    private int size;
    private List<?> data;

    public ListResponse(int code, String msg, int size, List<?> data) {
        super(code, msg);
        this.size = size;
        this.data = data;
    }
}

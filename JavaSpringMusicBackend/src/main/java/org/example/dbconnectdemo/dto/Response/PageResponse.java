package org.example.dbconnectdemo.dto.Response;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class PageResponse extends BaseResponse{
    private int currentPage;
    private int totalPage;
    private long records;
    private List<?> data;

    public PageResponse(int code, String msg, int currentPage, int totalPage, long records, List<?> data) {
        super(code, msg);
        this.currentPage = currentPage;
        this.totalPage = totalPage;
        this.records = records;
        this.data = data;
    }
}

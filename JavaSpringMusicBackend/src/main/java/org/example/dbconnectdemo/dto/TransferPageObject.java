package org.example.dbconnectdemo.dto;

import java.util.List;

public record TransferPageObject( int totalPage, long totalResult, List<?> data ) {
}

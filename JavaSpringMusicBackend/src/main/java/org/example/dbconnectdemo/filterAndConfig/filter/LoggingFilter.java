package org.example.dbconnectdemo.filterAndConfig.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;

import java.io.IOException;

@AllArgsConstructor
public class LoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        long startTime = System.currentTimeMillis();

        String query = httpRequest.getQueryString() == null ? "" : "?" + httpRequest.getQueryString();
        String remoteAddr = httpRequest.getRemoteAddr();
        String method = httpRequest.getMethod();

        System.out.println("Logging Filter: Incoming "+method+" request from " +remoteAddr+ " to " + httpRequest.getRequestURI() + query);

        chain.doFilter(request, response);
        long endTime = System.currentTimeMillis();
        long totalTime = endTime - startTime;

        System.out.println("Logging Filter: Response sent to "+remoteAddr+" for " + httpRequest.getRequestURI() + query);
        System.out.println("Processing time: "+totalTime+" ms");
    }
}

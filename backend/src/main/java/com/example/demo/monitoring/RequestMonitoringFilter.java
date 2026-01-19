package com.example.demo.monitoring;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class RequestMonitoringFilter extends OncePerRequestFilter {

    private final MonitoringService monitoringService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        long start = System.currentTimeMillis();
        boolean isError = false;
        
        try {
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            isError = true;
            throw e;
        } finally {
            long duration = System.currentTimeMillis() - start;
            int status = response.getStatus();
            if (status >= 400) isError = true;
            
            // Only track API requests
            String path = request.getRequestURI();
            if (path.startsWith("/api")) {
                monitoringService.recordRequest(path, duration, isError);
            }
        }
    }
}

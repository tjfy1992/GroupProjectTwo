package com.example.gateway.filter;

import com.example.gateway.config.AuthClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Component
public class PreFilter implements GlobalFilter {

    @Autowired
    private AuthClient authClient;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        String tokenHeader = request.getHeaders().getFirst("token");
        if(tokenHeader == null || tokenHeader.equals("")){
            return chain.filter(exchange).then(Mono.defer(() -> {
                response.setStatusCode(HttpStatus.FORBIDDEN);
                return Mono.empty();
            }));
        }
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("token", tokenHeader);
        Map<String, Object> resultMap = authClient.checkToken(paramMap);
        if(resultMap.get("authenticated") == null || resultMap.get("authenticated").equals("no")) {
            return chain.filter(exchange).then(Mono.defer(() -> {
                response.setStatusCode(HttpStatus.FORBIDDEN);
                return Mono.empty();
            }));
        }
        return chain.filter(exchange);
    }
}

package com.assignment.project.controller;
import com.google.common.hash.Hashing;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UrlController {

    private final Map<String, UrlData> urlMap = new HashMap<>();

    @PostMapping("/shorten")
    public ResponseEntity<String> shortenUrl(@RequestBody String longUrl) {
        // Generate a short URL using a hash of the long URL
        String shortUrl = Hashing.murmur3_32().hashString(longUrl, StandardCharsets.UTF_8).toString();
        UrlData urlData = new UrlData(longUrl, LocalDateTime.now());
        urlMap.put(shortUrl, urlData);

        return ResponseEntity.ok(shortUrl);
    }

    @GetMapping("/{shortUrl}")
    public ResponseEntity<String> redirectUrl(@PathVariable String shortUrl) {
        // Check if the short URL exists
        if (urlMap.containsKey(shortUrl)) {
            UrlData urlData = urlMap.get(shortUrl);

            // Check if the short URL has expired (5 minutes limit)
            LocalDateTime expirationTime = urlData.getCreatedAt().plusMinutes(5);
            if (LocalDateTime.now().isBefore(expirationTime)) {
                return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY).header("Location", urlData.getLongUrl()).build();
            } else {
                urlMap.remove(shortUrl);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("URL has expired.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("URL does not exist.");
        }
    }
    private static class UrlData {
        private final String longUrl;
        private final LocalDateTime createdAt;

        public UrlData(String longUrl, LocalDateTime createdAt) {
            this.longUrl = longUrl;
            this.createdAt = createdAt;
        }

        public String getLongUrl() {
            return longUrl;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
    }
}
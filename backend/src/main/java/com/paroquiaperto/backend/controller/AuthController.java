package com.paroquiaperto.backend.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.paroquiaperto.backend.model.User;
import com.paroquiaperto.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class AuthController {
    // Substitua pelo seu CLIENT_ID do Google
    private static final String GOOGLE_CLIENT_ID = "348004977357-46935g5vv612ak9qgb8prqp4o8pcd7dl.apps.googleusercontent.com";

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null) {
            return ResponseEntity.badRequest().body("Token Google não fornecido");
        }
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance()
            )
            .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
            .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                if (email == null) {
                    return ResponseEntity.status(400).body("Email não encontrado no token Google");
                }
                User user = userRepository.findByEmail(email).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name != null ? name : "Google User");
                    newUser.setPassword(""); // Senha vazia para login Google
                    newUser.setAuthProvider("google");
                    return userRepository.save(newUser);
                });
                    // Retorna dados do usuário, exceto senha
                    Map<String, Object> userData = Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "authProvider", user.getAuthProvider()
                    );
                    return ResponseEntity.ok(userData);
            } else {
                return ResponseEntity.status(401).body("Token Google inválido");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao validar token Google: " + e.getMessage());
        }
    }
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        if (name == null || email == null || password == null) {
            return ResponseEntity.badRequest().body("Nome, email e senha são obrigatórios");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email já cadastrado");
        }
    User user = new User();
    user.setName(name);
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(password));
    user.setAuthProvider("local");
    userRepository.save(user);
    return ResponseEntity.ok("Utilizador registrado com sucesso");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email e senha são obrigatórios");
        }
        return userRepository.findByEmail(email)
            .map(user -> {
                if (passwordEncoder.matches(password, user.getPassword())) {
                    // Retorna dados do usuário, exceto senha
                    Map<String, Object> userData = Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "authProvider", user.getAuthProvider()
                    );
                    return ResponseEntity.ok(userData);
                } else {
                    return ResponseEntity.status(401).body("Senha incorreta");
                }
            })
            .orElseGet(() -> ResponseEntity.status(404).body("Utilizador não encontrado"));
    }
}

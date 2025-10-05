package com.paroquiaperto.backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paroquiaperto.backend.model.User;
import com.paroquiaperto.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getUsuario(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Usuário não autenticado");
        }
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }
        return ResponseEntity.ok(userOpt.get());
    }

    @PatchMapping
    public ResponseEntity<?> updateUsuario(@AuthenticationPrincipal UserDetails userDetails, @RequestBody User updatedUser) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Usuário não autenticado");
        }
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }
        User user = userOpt.get();
        // Atualize os campos necessários
        user.setName(updatedUser.getName());
        // Adicione outros campos conforme necessário
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}

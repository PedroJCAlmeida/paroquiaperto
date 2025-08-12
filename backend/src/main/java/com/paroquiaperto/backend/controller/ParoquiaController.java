package com.paroquiaperto.backend.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paroquiaperto.backend.model.Paroquia;
import com.paroquiaperto.backend.repository.ParoquiaRepository;

@RestController
@RequestMapping("/api/paroquias")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class ParoquiaController {
    @GetMapping(params = "search")
    public ResponseEntity<List<Paroquia>> buscarParoquias(String search) {
        String termo = search.trim().toLowerCase();
        List<Paroquia> todas = paroquiaRepository.findAll();
        List<Paroquia> filtradas = todas.stream()
            .filter(p -> {
                boolean nomeCombina = p.getNome() != null && p.getNome().toLowerCase().contains(termo);
                boolean horarioCombina = false;
                if (p.getHorarios() != null) {
                    horarioCombina = p.getHorarios().stream().anyMatch(h -> h != null && h.toLowerCase().contains(termo));
                }
                return nomeCombina || horarioCombina;
            })
            .toList();
        return ResponseEntity.ok(filtradas);
    }
    @Autowired
    private ParoquiaRepository paroquiaRepository;

        @GetMapping
        public ResponseEntity<List<Paroquia>> listarParoquias() {
            List<Paroquia> paroquias = paroquiaRepository.findAll();
            return ResponseEntity.ok(paroquias);
        }
    @PostMapping
    public ResponseEntity<?> criarParoquia(@RequestBody Paroquia paroquia, @RequestHeader(value = "Authorization", required = false) String authorization) {
    System.out.println("Authorization header: " + authorization);

    if (paroquia.getNome() == null || paroquia.getNome().isEmpty()) {
        return ResponseEntity.badRequest().body("Nome da paróquia é obrigatório");
    }
    Paroquia saved = paroquiaRepository.save(paroquia);
    return ResponseEntity.ok(saved);
    }
}
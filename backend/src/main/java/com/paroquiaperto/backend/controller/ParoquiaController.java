package com.paroquiaperto.backend.controller;


import com.paroquiaperto.backend.model.Paroquia;
import com.paroquiaperto.backend.repository.ParoquiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paroquias")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class ParoquiaController {
    @Autowired
    private ParoquiaRepository paroquiaRepository;

    @PostMapping
    public ResponseEntity<?> criarParoquia(@RequestBody Paroquia paroquia) {
        if (paroquia.getNome() == null || paroquia.getNome().isEmpty()) {
            return ResponseEntity.badRequest().body("Nome da paróquia é obrigatório");
        }
        Paroquia saved = paroquiaRepository.save(paroquia);
        return ResponseEntity.ok(saved);
    }
}
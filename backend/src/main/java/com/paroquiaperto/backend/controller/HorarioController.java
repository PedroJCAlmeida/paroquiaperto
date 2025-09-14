package com.paroquiaperto.backend.controller;

import com.paroquiaperto.backend.model.Horario;
import com.paroquiaperto.backend.model.Paroquia;
import com.paroquiaperto.backend.repository.HorarioRepository;
import com.paroquiaperto.backend.repository.ParoquiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin
public class HorarioController {
    @Autowired
    private HorarioRepository horarioRepository;
    @Autowired
    private ParoquiaRepository paroquiaRepository;

    @PostMapping
    public ResponseEntity<?> criarHorario(@RequestBody Horario horario) {
        if (horario.getParoquia() == null || horario.getParoquia().getId() == null) {
            return ResponseEntity.badRequest().body("Paróquia obrigatória");
        }
        Paroquia paroquia = paroquiaRepository.findById(horario.getParoquia().getId()).orElse(null);
        if (paroquia == null) {
            return ResponseEntity.badRequest().body("Paróquia não encontrada");
        }
        horario.setParoquia(paroquia);
        Horario saved = horarioRepository.save(horario);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Horario>> listarHorarios() {
        return ResponseEntity.ok(horarioRepository.findAll());
    }
}

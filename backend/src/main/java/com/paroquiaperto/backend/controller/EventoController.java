package com.paroquiaperto.backend.controller;

import com.paroquiaperto.backend.model.Evento;
import com.paroquiaperto.backend.model.Paroquia;
import com.paroquiaperto.backend.repository.EventoRepository;
import com.paroquiaperto.backend.repository.ParoquiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin
public class EventoController {
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private ParoquiaRepository paroquiaRepository;

    @PostMapping
    public ResponseEntity<?> criarEvento(@RequestBody Evento evento) {
        if (evento.getParoquia() == null || evento.getParoquia().getId() == null) {
            return ResponseEntity.badRequest().body("Paróquia obrigatória");
        }
        Paroquia paroquia = paroquiaRepository.findById(evento.getParoquia().getId()).orElse(null);
        if (paroquia == null) {
            return ResponseEntity.badRequest().body("Paróquia não encontrada");
        }
        evento.setParoquia(paroquia);
        Evento saved = eventoRepository.save(evento);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Evento>> listarEventos() {
        return ResponseEntity.ok(eventoRepository.findAll());
    }
}

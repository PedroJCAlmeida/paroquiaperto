// src/main/java/com/paroquiaperto/backend/controller/EventoController.java

package com.paroquiaperto.backend.controller;

import com.paroquiaperto.backend.model.Evento;
import com.paroquiaperto.backend.repository.EventoRepository;
import com.paroquiaperto.backend.model.Paroquia; // Necessário para associar Evento a Paroquia
import com.paroquiaperto.backend.repository.ParoquiaRepository; // Necessário para encontrar a Paroquia

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos") // Endpoint base para eventos
@CrossOrigin(origins = "http://localhost:3000") // Permite requisições do seu frontend React (ajuste a porta se necessário)
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private ParoquiaRepository paroquiaRepository; // Para buscar a Paroquia associada

    // --- GET: Listar todos os Eventos ---
    @GetMapping
    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

    // --- GET: Obter Evento por ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Evento> getEventoById(@PathVariable Long id) {
        return eventoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- POST: Criar um novo Evento ---
    // A requisição JSON deve incluir o 'paroquia_id' (ou um objeto 'paroquia' aninhado)
    // para associar o evento à paróquia.
    @PostMapping
    public ResponseEntity<Evento> createEvento(@RequestBody Evento evento) {
        if (evento.getParoquia() != null && evento.getParoquia().getId() != null) {
            return paroquiaRepository.findById(evento.getParoquia().getId())
                    .map(paroquia -> {
                        evento.setParoquia(paroquia); // Associa o Evento à Paróquia encontrada
                        Evento savedEvento = eventoRepository.save(evento);
                        return new ResponseEntity<>(savedEvento, HttpStatus.CREATED);
                    })
                    .orElse(ResponseEntity.badRequest().build()); // Paróquia não existe
        }
        return ResponseEntity.badRequest().build(); // Paróquia não fornecida
    }

    // --- PUT: Atualizar um Evento existente ---
    @PutMapping("/{id}")
    public ResponseEntity<Evento> updateEvento(@PathVariable Long id, @RequestBody Evento eventoDetails) {
        return eventoRepository.findById(id)
                .map(evento -> {
                    evento.setTitulo(eventoDetails.getTitulo());
                    evento.setDescricao(eventoDetails.getDescricao());
                    evento.setDataHoraInicio(eventoDetails.getDataHoraInicio());
                    evento.setDataHoraFim(eventoDetails.getDataHoraFim());
                    evento.setLocal(eventoDetails.getLocal());
                    evento.setImagemUrl(eventoDetails.getImagemUrl());

                    // Se uma nova Paróquia for fornecida nos detalhes, atualiza a associação
                    if (eventoDetails.getParoquia() != null && eventoDetails.getParoquia().getId() != null) {
                        return paroquiaRepository.findById(eventoDetails.getParoquia().getId())
                                .map(newParoquia -> {
                                    evento.setParoquia(newParoquia);
                                    return ResponseEntity.ok(eventoRepository.save(evento));
                                })
                                .orElse(ResponseEntity.badRequest().build()); // Paróquia fornecida não encontrada
                    } else if (eventoDetails.getParoquia() == null) {
                         // Se 'paroquia' for explicitamente definida como null nos detalhes,
                         // e a relação é nullable=false, pode gerar erro.
                         // Para este caso, vamos manter a paróquia existente ou tratar o erro.
                         // Como definimos 'paroquia_id' como nullable=false no Evento,
                         // não podemos desassociar o Evento da Paróquia sem deletar.
                         // Então, se eventoDetails.getParoquia() for null, assumimos que
                         // a associação existente deve ser mantida.
                        return ResponseEntity.ok(eventoRepository.save(evento));
                    }
                    return ResponseEntity.ok(eventoRepository.save(evento));
                }).orElse(ResponseEntity.notFound().build());
    }

    // --- DELETE: Deletar um Evento ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteEvento(@PathVariable Long id) {
        return eventoRepository.findById(id)
                .map(evento -> {
                    eventoRepository.delete(evento);
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
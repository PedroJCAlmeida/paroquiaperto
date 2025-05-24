// src/main/java/com/paroquiaperto/backend/controller/EventoController.java

package com.paroquiaperto.backend.controller;

import com.paroquiaperto.backend.model.Evento;
import com.paroquiaperto.backend.repository.EventoRepository;
import com.paroquiaperto.backend.repository.ParoquiaRepository;
import com.paroquiaperto.backend.dto.EventoDTO; // Importar o EventoDTO
import com.paroquiaperto.backend.mapper.EventoMapper; // Importar o EventoMapper

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://localhost:3000") // Permite requisições do seu frontend React
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private ParoquiaRepository paroquiaRepository;

    @Autowired
    private EventoMapper eventoMapper; // <--- Injete o EventoMapper aqui!

    // --- GET: Listar todos os Eventos ---
    @GetMapping
    public List<EventoDTO> getAllEventos() { // <--- Retorna uma lista de EventoDTOs
        return eventoRepository.findAll().stream()
                .map(eventoMapper::toDto) // <--- Converte cada Entidade em DTO
                .collect(Collectors.toList());
    }

    // --- GET: Obter Evento por ID ---
    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> getEventoById(@PathVariable Long id) { // <--- Retorna um EventoDTO
        return eventoRepository.findById(id)
                .map(eventoMapper::toDto) // <--- Converte a Entidade em DTO
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- POST: Criar um novo Evento ---
    @PostMapping
    public ResponseEntity<EventoDTO> createEvento(@RequestBody EventoDTO eventoDTO) { // <--- Recebe um EventoDTO
        // Verifique se o paroquiaId foi fornecido no DTO
        if (eventoDTO.getParoquiaId() == null) {
            return ResponseEntity.badRequest().build(); // Retorna 400 se o ID da paróquia não for fornecido
        }

        return paroquiaRepository.findById(eventoDTO.getParoquiaId()) // Busca a Paróquia real pelo ID
                .map(paroquia -> {
                    Evento evento = eventoMapper.toEntity(eventoDTO); // Converte DTO para Entidade
                    evento.setParoquia(paroquia); // Associa a Paróquia encontrada ao Evento
                    Evento savedEvento = eventoRepository.save(evento);
                    return new ResponseEntity<>(eventoMapper.toDto(savedEvento), HttpStatus.CREATED); // Retorna o DTO salvo
                })
                .orElse(ResponseEntity.badRequest().build()); // Retorna 400 se a Paróquia não for encontrada
    }

    // --- PUT: Atualizar um Evento existente ---
    @PutMapping("/{id}")
    public ResponseEntity<EventoDTO> updateEvento(@PathVariable Long id, @RequestBody EventoDTO eventoDetailsDTO) { // <--- Recebe um EventoDTO
        return eventoRepository.findById(id)
                .map(evento -> {
                    // Se um novo paroquiaId for fornecido, atualiza a associação da Paróquia
                    if (eventoDetailsDTO.getParoquiaId() != null) {
                        return paroquiaRepository.findById(eventoDetailsDTO.getParoquiaId())
                                .map(newParoquia -> {
                                    eventoMapper.updateEntityFromDto(eventoDetailsDTO, evento); // Atualiza outros campos
                                    evento.setParoquia(newParoquia); // Atualiza a Paróquia
                                    Evento updatedEvento = eventoRepository.save(evento);
                                    return ResponseEntity.ok(eventoMapper.toDto(updatedEvento)); // Retorna DTO atualizado
                                })
                                .orElse(ResponseEntity.badRequest().build()); // Paróquia fornecida não encontrada
                    } else {
                        // Se nenhum paroquiaId for fornecido no DTO de atualização,
                        // apenas atualiza os outros campos e mantém a associação de paróquia existente.
                        eventoMapper.updateEntityFromDto(eventoDetailsDTO, evento);
                        Evento updatedEvento = eventoRepository.save(evento);
                        return ResponseEntity.ok(eventoMapper.toDto(updatedEvento));
                    }
                }).orElse(ResponseEntity.notFound().build()); // Evento não encontrado
    }

    // --- DELETE: Deletar um Evento ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteEvento(@PathVariable Long id) {
        return eventoRepository.findById(id)
                .map(evento -> {
                    eventoRepository.delete(evento);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
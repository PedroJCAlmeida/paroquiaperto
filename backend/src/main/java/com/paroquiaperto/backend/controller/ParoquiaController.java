// src/main/java/com/paroquiaperto/backend/controller/ParoquiaController.java

package com.paroquiaperto.backend.controller;

import com.paroquiaperto.backend.model.Paroquia;
import com.paroquiaperto.backend.repository.ParoquiaRepository;
import com.paroquiaperto.backend.dto.ParoquiaDTO; // Importe o DTO
import com.paroquiaperto.backend.mapper.ParoquiaMapper; // Importe o Mapper

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/paroquias")
@CrossOrigin(origins = "http://localhost:3000") // Permite requisições do seu frontend React
public class ParoquiaController {

    @Autowired
    private ParoquiaRepository paroquiaRepository;

    @Autowired
    private ParoquiaMapper paroquiaMapper; // <--- Injete a interface do Mapper aqui!


    // --- GET: Listar todas as Paroquias ---
    @GetMapping
    public List<ParoquiaDTO> getAllParoquias() { // <--- Retorna uma lista de DTOs
        return paroquiaRepository.findAll().stream()
                .map(paroquiaMapper::toDto) // <--- Use o mapper para converter cada Entidade em DTO
                .collect(Collectors.toList());
    }

    // --- GET: Obter Paroquia por ID ---
    @GetMapping("/{id}")
    public ResponseEntity<ParoquiaDTO> getParoquiaById(@PathVariable Long id) { // <--- Retorna um DTO
        return paroquiaRepository.findById(id)
                .map(paroquiaMapper::toDto) // <--- Use o mapper para converter a Entidade em DTO
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- POST: Criar uma nova Paroquia ---
    @PostMapping
    public ResponseEntity<ParoquiaDTO> createParoquia(@RequestBody ParoquiaDTO paroquiaDto) { // <--- Recebe um DTO
        Paroquia paroquia = paroquiaMapper.toEntity(paroquiaDto); // <--- Converte o DTO para Entidade
        Paroquia savedParoquia = paroquiaRepository.save(paroquia);
        return new ResponseEntity<>(paroquiaMapper.toDto(savedParoquia), HttpStatus.CREATED); // <--- Retorna o DTO salvo
    }

    // --- PUT: Atualizar uma Paroquia ---
    @PutMapping("/{id}")
    public ResponseEntity<ParoquiaDTO> updateParoquia(@PathVariable Long id, @RequestBody ParoquiaDTO paroquiaDetailsDto) { // <--- Recebe um DTO
        return paroquiaRepository.findById(id).map(paroquia -> {
            // Usa o método updateEntityFromDto para atualizar a entidade existente com os dados do DTO
            paroquiaMapper.updateEntityFromDto(paroquiaDetailsDto, paroquia);

            Paroquia updatedParoquia = paroquiaRepository.save(paroquia);
            return ResponseEntity.ok(paroquiaMapper.toDto(updatedParoquia)); // <--- Retorna o DTO atualizado
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- DELETE: Deletar uma Paroquia ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteParoquia(@PathVariable Long id) {
        return paroquiaRepository.findById(id).map(paroquia -> {
            paroquiaRepository.delete(paroquia);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
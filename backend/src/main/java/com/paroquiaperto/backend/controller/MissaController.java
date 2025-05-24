// src/main/java/com/paroquiaperto/backend/controller/MissaController.java

package com.paroquiaperto.backend.controller;

import com.paroquiaperto.backend.model.Missa;
import com.paroquiaperto.backend.repository.MissaRepository;
import com.paroquiaperto.backend.model.Paroquia; // Necessário para associar Missa a Paroquia
import com.paroquiaperto.backend.repository.ParoquiaRepository; // Necessário para encontrar a Paroquia

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Para retornar diferentes status HTTP
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/missas") // Endpoint base para missas
@CrossOrigin(origins = "http://localhost:3000") // Permite requisições do seu frontend React (ajuste a porta se necessário)
public class MissaController {

    @Autowired
    private MissaRepository missaRepository;

    @Autowired
    private ParoquiaRepository paroquiaRepository; // Para buscar a Paroquia associada

    // --- GET: Listar todas as Missas ---
    @GetMapping
    public List<Missa> getAllMissas() {
        return missaRepository.findAll();
    }

    // --- GET: Obter Missa por ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Missa> getMissaById(@PathVariable Long id) {
        return missaRepository.findById(id)
                .map(ResponseEntity::ok) // Se encontrar, retorna 200 OK com a Missa
                .orElse(ResponseEntity.notFound().build()); // Se não encontrar, retorna 404 Not Found
    }

    // --- POST: Criar uma nova Missa ---
    // A requisição JSON deve incluir o 'paroquia_id' (ou um objeto 'paroquia' aninhado)
    // para associar a missa à paróquia.
    @PostMapping
    public ResponseEntity<Missa> createMissa(@RequestBody Missa missa) {
        // Antes de salvar a Missa, precisamos garantir que a Paróquia associada exista no DB
        if (missa.getParoquia() != null && missa.getParoquia().getId() != null) {
            return paroquiaRepository.findById(missa.getParoquia().getId())
                    .map(paroquia -> {
                        missa.setParoquia(paroquia); // Associa a Missa à Paróquia encontrada
                        Missa savedMissa = missaRepository.save(missa);
                        return new ResponseEntity<>(savedMissa, HttpStatus.CREATED); // Retorna 201 Created
                    })
                    .orElse(ResponseEntity.badRequest().build()); // Se a Paróquia não existe, retorna 400 Bad Request
        }
        return ResponseEntity.badRequest().build(); // Se a Paróquia não foi fornecida
    }

    // --- PUT: Atualizar uma Missa existente ---
    @PutMapping("/{id}")
    public ResponseEntity<Missa> updateMissa(@PathVariable Long id, @RequestBody Missa missaDetails) {
        return missaRepository.findById(id)
                .map(missa -> {
                    // Atualiza os campos da Missa existente com os detalhes fornecidos
                    missa.setHorario(missaDetails.getHorario());
                    missa.setDescricao(missaDetails.getDescricao());

                    // Se uma nova Paróquia for fornecida nos detalhes, atualiza a associação
                    if (missaDetails.getParoquia() != null && missaDetails.getParoquia().getId() != null) {
                        return paroquiaRepository.findById(missaDetails.getParoquia().getId())
                                .map(newParoquia -> {
                                    missa.setParoquia(newParoquia);
                                    return ResponseEntity.ok(missaRepository.save(missa));
                                })
                                .orElse(ResponseEntity.badRequest().build()); // Paróquia fornecida não encontrada
                    } else if (missaDetails.getParoquia() == null) {
                        // Se 'paroquia' for explicitamente definida como null nos detalhes,
                        // e a relação é nullable=false, pode gerar erro.
                        // Para este caso, vamos manter a paróquia existente ou tratar o erro.
                        // Como definimos 'paroquia_id' como nullable=false na Missa,
                        // não podemos desassociar a Missa da Paróquia sem deletar.
                        // Então, se missaDetails.getParoquia() for null, assumimos que
                        // a associação existente deve ser mantida.
                        return ResponseEntity.ok(missaRepository.save(missa));
                    }
                    return ResponseEntity.ok(missaRepository.save(missa)); // Salva a Missa atualizada
                }).orElse(ResponseEntity.notFound().build()); // Se a Missa não for encontrada, retorna 404
    }

    // --- DELETE: Deletar uma Missa ---
     @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMissa(@PathVariable Long id) { // <--- Alterado para ResponseEntity<Void>
        return missaRepository.findById(id)
                .map(missa -> {
                    missaRepository.delete(missa);
                    return ResponseEntity.noContent().build(); // <--- Retorna 204 No Content
                })
                .orElse(ResponseEntity.notFound().build()); // <--- Retorna 404 Not Found
    }
}

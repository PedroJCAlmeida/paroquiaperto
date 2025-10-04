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

import com.paroquiaperto.backend.model.Conselho;
import com.paroquiaperto.backend.model.Distrito;
import com.paroquiaperto.backend.model.Paroquia;
import com.paroquiaperto.backend.repository.ConselhoRepository;
import com.paroquiaperto.backend.repository.DistritoRepository;
import com.paroquiaperto.backend.repository.ParoquiaRepository;
import com.paroquiaperto.backend.service.GeoNamesService;

@RestController
@RequestMapping("/api/paroquias")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class ParoquiaController {
    @GetMapping("/{id}")
    public ResponseEntity<Paroquia> buscarPorId(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return paroquiaRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
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
    @Autowired
    private GeoNamesService geoNamesService;
    @Autowired
    private DistritoRepository distritoRepository;
    @Autowired
    private ConselhoRepository conselhoRepository;

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

        // Buscar distrito e conselho pelo código postal (extraído do endereço)
        String codigoPostal = extrairCodigoPostal(paroquia.getEndereco());
        if (codigoPostal != null && !codigoPostal.isEmpty()) {
            GeoNamesService.GeoInfo info = geoNamesService.buscarPorCodigoPostal(codigoPostal);
            if (info != null) {
                // Buscar Distrito pelo nome
                Distrito distrito = distritoRepository.findAll().stream()
                    .filter(d -> d.getNome().equalsIgnoreCase(info.distrito))
                    .findFirst().orElse(null);
                if (distrito != null) {
                    paroquia.setDistrito(distrito);
                    // Buscar Conselho pelo nome e distrito
                    Conselho conselho = conselhoRepository.findByDistritoId(distrito.getId()).stream()
                        .filter(c -> c.getNome().equalsIgnoreCase(info.conselho))
                        .findFirst().orElse(null);
                    if (conselho != null) {
                        paroquia.setConselho(conselho);
                    }
                }
            }
        }

        Paroquia saved = paroquiaRepository.save(paroquia);
        return ResponseEntity.ok(saved);
    }

    // Extrai o código postal do endereço (formato 1234-567)
    private String extrairCodigoPostal(String endereco) {
        if (endereco == null) return null;
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("(\\d{4}-\\d{3})").matcher(endereco);
        if (m.find()) return m.group(1);
        return null;
    }
}
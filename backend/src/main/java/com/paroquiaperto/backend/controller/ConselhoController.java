package com.paroquiaperto.backend.controller;

import com.paroquiaperto.backend.model.Conselho;
import com.paroquiaperto.backend.repository.ConselhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/conselhos")
@CrossOrigin(origins = {"*"})
public class ConselhoController {
    @Autowired
    private ConselhoRepository conselhoRepository;

    @GetMapping
    public List<Conselho> listarConselhos(@RequestParam(required = false) Long distritoId) {
        if (distritoId != null) {
            return conselhoRepository.findByDistritoId(distritoId);
        }
        return conselhoRepository.findAll();
    }
}

package com.paroquiaperto.backend.controller;

import com.paroquiaperto.backend.model.Distrito;
import com.paroquiaperto.backend.repository.DistritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/distritos")
@CrossOrigin(origins = {"*"})
public class DistritoController {
    @Autowired
    private DistritoRepository distritoRepository;

    @GetMapping
    public List<Distrito> listarDistritos() {
        return distritoRepository.findAll();
    }
}

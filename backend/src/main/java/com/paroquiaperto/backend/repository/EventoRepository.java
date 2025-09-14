package com.paroquiaperto.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.paroquiaperto.backend.model.Evento;

public interface EventoRepository extends JpaRepository<Evento, Long> {
}

package com.paroquiaperto.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.paroquiaperto.backend.model.Horario;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
}

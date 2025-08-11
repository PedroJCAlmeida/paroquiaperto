package com.paroquiaperto.backend.repository;

import com.paroquiaperto.backend.model.Paroquia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParoquiaRepository extends JpaRepository<Paroquia, Long> {
}

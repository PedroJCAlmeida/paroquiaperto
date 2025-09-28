package com.paroquiaperto.backend.repository;

import com.paroquiaperto.backend.model.Conselho;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConselhoRepository extends JpaRepository<Conselho, Long> {
    List<Conselho> findByDistritoId(Long distritoId);
}

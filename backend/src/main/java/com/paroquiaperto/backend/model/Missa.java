package com.paroquiaperto.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "missas")
public class Missa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime horario;

    @Column(length = 500)
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "paroquia_id", nullable = false)
    private Paroquia paroquia;

    // Construtores
    public Missa() {}

    public Missa(LocalDateTime horario, String descricao, Paroquia paroquia) {
        this.horario = horario;
        this.descricao = descricao;
        this.paroquia = paroquia;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getHorario() { return horario; }
    public void setHorario(LocalDateTime horario) { this.horario = horario; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Paroquia getParoquia() { return paroquia; }
    public void setParoquia(Paroquia paroquia) { this.paroquia = paroquia; }
}
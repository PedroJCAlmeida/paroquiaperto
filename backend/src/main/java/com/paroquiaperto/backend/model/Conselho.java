package com.paroquiaperto.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "conselhos")
public class Conselho {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "distrito_id", nullable = false)
    @JsonBackReference
    private Distrito distrito;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Distrito getDistrito() { return distrito; }
    public void setDistrito(Distrito distrito) { this.distrito = distrito; }
}

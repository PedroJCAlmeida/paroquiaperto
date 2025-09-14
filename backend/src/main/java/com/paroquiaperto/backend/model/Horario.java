package com.paroquiaperto.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "horarios")
public class Horario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String diaSemana;

    @Column(nullable = false)
    private String hora;

    @Column(nullable = false)
    private String tipo;

    @ManyToOne
    @JoinColumn(name = "paroquia_id", nullable = false)
    private Paroquia paroquia;

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }
    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Paroquia getParoquia() { return paroquia; }
    public void setParoquia(Paroquia paroquia) { this.paroquia = paroquia; }
}

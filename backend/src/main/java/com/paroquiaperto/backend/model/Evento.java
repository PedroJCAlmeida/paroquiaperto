package com.paroquiaperto.backend.model;

import jakarta.persistence.Column; // Importar para @Column
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table; // Importar para @Table

import java.time.LocalDateTime;

@Entity
@Table(name = "eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private LocalDateTime dataHoraInicio;

    private LocalDateTime dataHoraFim;

    @Column(length = 2000)
    private String descricao;

    private String local;

    private String imagemUrl;

    @ManyToOne
    @JoinColumn(name = "paroquia_id", nullable = false)
    private Paroquia paroquia;

    // Construtores
    public Evento() {}

    public Evento(String titulo, LocalDateTime dataHoraInicio, String descricao, Paroquia paroquia) {
        this.titulo = titulo;
        this.dataHoraInicio = dataHoraInicio;
        this.descricao = descricao;
        this.paroquia = paroquia;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public LocalDateTime getDataHoraInicio() { return dataHoraInicio; }
    public void setDataHoraInicio(LocalDateTime dataHoraInicio) { this.dataHoraInicio = dataHoraInicio; }

    public LocalDateTime getDataHoraFim() { return dataHoraFim; }
    public void setDataHoraFim(LocalDateTime dataHoraFim) { this.dataHoraFim = dataHoraFim; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getLocal() { return local; }
    public void setLocal(String local) { this.local = local; }

    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }

    public Paroquia getParoquia() { return paroquia; }
    public void setParoquia(Paroquia paroquia) { this.paroquia = paroquia; }
}
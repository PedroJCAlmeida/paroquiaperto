// src/main/java/com/paroquiaperto/backend/dto/EventoDTO.java

package com.paroquiaperto.backend.dto;

import java.time.LocalDateTime;

public class EventoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;
    private String local;
    private String imagemUrl;
    private Long paroquiaId;

    // Construtores
    public EventoDTO() {}

    public EventoDTO(Long id, String titulo, String descricao, LocalDateTime dataHoraInicio, 
                     LocalDateTime dataHoraFim, String local, String imagemUrl, Long paroquiaId) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataHoraInicio = dataHoraInicio;
        this.dataHoraFim = dataHoraFim;
        this.local = local;
        this.imagemUrl = imagemUrl;
        this.paroquiaId = paroquiaId;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDateTime getDataHoraInicio() { return dataHoraInicio; }
    public void setDataHoraInicio(LocalDateTime dataHoraInicio) { this.dataHoraInicio = dataHoraInicio; }

    public LocalDateTime getDataHoraFim() { return dataHoraFim; }
    public void setDataHoraFim(LocalDateTime dataHoraFim) { this.dataHoraFim = dataHoraFim; }

    public String getLocal() { return local; }
    public void setLocal(String local) { this.local = local; }

    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }

    public Long getParoquiaId() { return paroquiaId; }
    public void setParoquiaId(Long paroquiaId) { this.paroquiaId = paroquiaId; }
}
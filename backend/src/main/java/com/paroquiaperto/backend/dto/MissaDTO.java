// src/main/java/com/paroquiaperto/backend/dto/MissaDTO.java

package com.paroquiaperto.backend.dto;

import java.time.LocalDateTime;

public class MissaDTO {
    private Long id;
    private LocalDateTime horario;
    private String descricao;
    // O ID da Paróquia associada é o que o frontend enviará e receberá
    private Long paroquiaId;
    // Opcional: Se quiser incluir o nome da paróquia para exibição simples sem buscar a paróquia inteira
    // private String paroquiaNome;

    // Construtores
    public MissaDTO() {}

    public MissaDTO(Long id, LocalDateTime horario, String descricao, Long paroquiaId) {
        this.id = id;
        this.horario = horario;
        this.descricao = descricao;
        this.paroquiaId = paroquiaId;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getHorario() { return horario; }
    public void setHorario(LocalDateTime horario) { this.horario = horario; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Long getParoquiaId() { return paroquiaId; }
    public void setParoquiaId(Long paroquiaId) { this.paroquiaId = paroquiaId; }
}
// src/main/java/com/paroquiaperto/backend/dto/EventoDTO.java

package com.paroquiaperto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data // Anotação Lombok para gerar getters, setters, toString, equals e hashCode
@NoArgsConstructor // Anotação Lombok para gerar construtor sem argumentos
@AllArgsConstructor // Anotação Lombok para gerar construtor com todos os argumentos
public class EventoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private LocalDateTime dataHoraInicio; // Usar o nome do campo da Entidade Evento
    private LocalDateTime dataHoraFim;    // Usar o nome do campo da Entidade Evento
    private String local;
    private String imagemUrl;
    // O ID da Paróquia associada
    private Long paroquiaId;
    // Opcional: Se quiser incluir o nome da paróquia para exibição simples
    // private String paroquiaNome;
}
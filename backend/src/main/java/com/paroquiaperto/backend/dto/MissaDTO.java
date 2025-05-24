// src/main/java/com/paroquiaperto/backend/dto/MissaDTO.java

package com.paroquiaperto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data // Anotação Lombok para gerar getters, setters, toString, equals e hashCode
@NoArgsConstructor // Anotação Lombok para gerar construtor sem argumentos
@AllArgsConstructor // Anotação Lombok para gerar construtor com todos os argumentos
public class MissaDTO {
    private Long id;
    private LocalDateTime horario;
    private String descricao;
    // O ID da Paróquia associada é o que o frontend enviará e receberá
    private Long paroquiaId;
    // Opcional: Se quiser incluir o nome da paróquia para exibição simples sem buscar a paróquia inteira
    // private String paroquiaNome;
}
// src/main/java/com/paroquiaperto/backend/dto/ParoquiaDTO.java

package com.paroquiaperto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Se você precisar incluir listas de Missas ou Eventos no DTO da Paróquia,
// elas deveriam ser MissaDTO e EventoDTO, respectivamente, para evitar loops.
// Por enquanto, vamos manter este DTO da Paróquia simples, sem os relacionamentos diretos.
// Isso é uma boa prática para evitar serializações complexas demais ou loops.

@Data // Anotação Lombok para gerar getters, setters, toString, equals e hashCode
@NoArgsConstructor // Anotação Lombok para gerar construtor sem argumentos
@AllArgsConstructor // Anotação Lombok para gerar construtor com todos os argumentos
public class ParoquiaDTO {
    private Long id;
    private String nome;
    private String endereco;
    private String descricao;
    private String imageUrl; // Usamos 'imageUrl' aqui para o DTO, alinhado com o que o frontend pode esperar
    private Double latitude;
    private Double longitude;
}
// src/main/java/com/paroquiaperto/backend/dto/ParoquiaDTO.java

package com.paroquiaperto.backend.dto;

// Se você precisar incluir listas de Missas ou Eventos no DTO da Paróquia,
// elas deveriam ser MissaDTO e EventoDTO, respectivamente, para evitar loops.
// Por enquanto, vamos manter este DTO da Paróquia simples, sem os relacionamentos diretos.
// Isso é uma boa prática para evitar serializações complexas demais ou loops.

public class ParoquiaDTO {
    private Long id;
    private String nome;
    private String endereco;
    private String descricao;
    private String imageUrl; // Usamos 'imageUrl' aqui para o DTO, alinhado com o que o frontend pode esperar
    private Double latitude;
    private Double longitude;

    // Construtores
    public ParoquiaDTO() {}

    public ParoquiaDTO(Long id, String nome, String endereco, String descricao, 
                       String imageUrl, Double latitude, Double longitude) {
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.descricao = descricao;
        this.imageUrl = imageUrl;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
package com.paroquiaperto.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "eventos")
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String data;

    @Column(nullable = false)
    private String hora;

    @Column
    private String descricao;

    @Column
    private String imagem;

    @ManyToOne
    @JoinColumn(name = "paroquia_id", nullable = false)
    private Paroquia paroquia;

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }
    public Paroquia getParoquia() { return paroquia; }
    public void setParoquia(Paroquia paroquia) { this.paroquia = paroquia; }
}

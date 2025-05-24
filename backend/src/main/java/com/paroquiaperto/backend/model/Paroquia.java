package com.paroquiaperto.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column; // Importar para @Column
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table; // Importar para @Table (opcional, mas boa prática)

import java.util.List;

// Importações Lombok (se optar por usá-lo)
import lombok.AllArgsConstructor; // Para construtor com todos os argumentos
import lombok.Data;             // Para getters, setters, toString, equals, hashCode
import lombok.NoArgsConstructor;   // Para construtor sem argumentos (padrão)

@Data // Anotação Lombok para gerar getters, setters, toString, equals e hashCode
@NoArgsConstructor // Anotação Lombok para gerar construtor sem argumentos (necessário para JPA)
@AllArgsConstructor // Anotação Lombok para gerar construtor com todos os argumentos
@Entity // Indica que esta classe é uma entidade JPA e será mapeada para uma tabela
@Table(name = "paroquias") // Define o nome da tabela no banco de dados (boa prática)
public class Paroquia {

    @Id // Define 'id' como a chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configura a geração automática de ID (auto-incremento)
    private Long id;

    @Column(nullable = false, unique = true) // Nome não pode ser nulo e deve ser único
    private String nome;

    @Column(nullable = false) // Endereço não pode ser nulo
    private String endereco;

    @Column(nullable = false) // Latitude não pode ser nula
    private double latitude;

    @Column(nullable = false) // Longitude não pode ser nula
    private double longitude;

    private String descricao; // Descrição pode ser nula

    private String imagemUrl; // Novo campo para a URL da imagem (pode ser nulo)

    // @OneToMany para Missas:
    // mappedBy = "paroquia" indica que a relação é gerenciada pelo campo 'paroquia' na entidade Missa.
    // cascade = CascadeType.ALL significa que operações como persist, merge, remove etc.,
    // aplicadas a Paroquia, serão propagadas para as entidades Missa associadas.
    // orphanRemoval = true: Garante que se uma Missa for removida da lista 'misas' de uma Paroquia,
    // ela será deletada do banco de dados.
    @OneToMany(mappedBy = "paroquia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Missa> missas; // Alterado de 'misas' para 'missas' (mais comum em português)

    // @OneToMany para Eventos:
    // Similar ao de Missas.
    @OneToMany(mappedBy = "paroquia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Evento> eventos;

    // Se não usar Lombok, você precisaria manter os getters e setters que já tinha
    // e adicionar construtores. Exemplo (sem Lombok):
    /*
    // Construtor vazio (necessário para JPA)
    public Paroquia() {}

    // Construtor com campos básicos
    public Paroquia(String nome, String endereco, double latitude, double longitude) {
        this.nome = nome;
        this.endereco = endereco;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    // E todos os getters e setters que já estavam
    */
}
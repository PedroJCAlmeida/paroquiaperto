// src/main/java/com/paroquiaperto/backend/model/Missa.java

package com.paroquiaperto.backend.model;

import jakarta.persistence.Column; // Importar para @Column
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table; // Importar para @Table

import java.time.LocalDateTime; // Para data e hora específicas da Missa

// Importações Lombok (se você decidiu usar Lombok no seu projeto)
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Gera getters, setters, toString, equals e hashCode
@NoArgsConstructor // Gera construtor sem argumentos (necessário para JPA)
@AllArgsConstructor // Gera construtor com todos os argumentos
@Entity // Indica que esta classe é uma entidade JPA e será mapeada para uma tabela
@Table(name = "missas") // Define o nome da tabela no banco de dados
public class Missa {

    @Id // Define 'id' como a chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configura a geração automática de ID (auto-incremento)
    private Long id;

    @Column(nullable = false) // Horário não pode ser nulo
    private LocalDateTime horario;

    @Column(length = 500) // Descrição da missa (opcional, mas com limite de tamanho)
    private String descricao;

    // Relacionamento Many-to-One com Paroquia:
    // Muitas Missas podem pertencer a uma Paróquia.
    @ManyToOne // Define o relacionamento Many-to-One
    @JoinColumn(name = "paroquia_id", nullable = false) // 'paroquia_id' é a chave estrangeira, não pode ser nula
    private Paroquia paroquia;

    // Se você não estiver usando Lombok, os getters e setters que você já tinha
    // continuam sendo necessários e devem ser mantidos.
    // Exemplo de como seriam os construtores sem Lombok:
    /*
    // Construtor padrão (necessário para JPA)
    public Missa() {}

    // Construtor com campos necessários (exemplo, você pode criar outros)
    public Missa(LocalDateTime horario, String descricao, Paroquia paroquia) {
        this.horario = horario;
        this.descricao = descricao;
        this.paroquia = paroquia;
    }
    */
}
package com.paroquiaperto.backend.model;

import jakarta.persistence.Column; // Importar para @Column
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table; // Importar para @Table

import java.time.LocalDateTime; // Para data e hora de início/fim

// Importações Lombok (se você decidiu usar Lombok no seu projeto)
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Gera getters, setters, toString, equals e hashCode
@NoArgsConstructor // Gera construtor sem argumentos (necessário para JPA)
@AllArgsConstructor // Gera construtor com todos os argumentos
@Entity // Indica que esta classe é uma entidade JPA e será mapeada para uma tabela
@Table(name = "eventos") // Define o nome da tabela no banco de dados
public class Evento {

    @Id // Define 'id' como a chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configura a geração automática de ID
    private Long id;

    @Column(nullable = false) // Título não pode ser nulo
    private String titulo;

    @Column(nullable = false) // Data e hora de início não podem ser nulas
    private LocalDateTime dataHoraInicio; // Renomeado para mais clareza

    private LocalDateTime dataHoraFim; // Data e hora de fim (pode ser nula para eventos sem duração definida)

    @Column(length = 2000) // Descrição do evento (aumentei o limite para 2000 caracteres)
    private String descricao;

    private String local; // Local específico do evento, se não for na própria paróquia (opcional)

    private String imagemUrl; // URL de uma imagem para o evento (opcional)

    // Relacionamento Many-to-One com Paroquia:
    // Muitos Eventos podem pertencer a uma Paróquia.
    @ManyToOne // Define o relacionamento Many-to-One
    @JoinColumn(name = "paroquia_id", nullable = false) // 'paroquia_id' é a chave estrangeira, não pode ser nula
    private Paroquia paroquia;

    // Se você não estiver usando Lombok, os getters e setters que você já tinha
    // continuam sendo necessários e devem ser mantidos.
    // Exemplo de como seriam os construtores sem Lombok:
    /*
    // Construtor padrão (necessário para JPA)
    public Evento() {}

    // Construtor com campos necessários (exemplo)
    public Evento(String titulo, LocalDateTime dataHoraInicio, String descricao, Paroquia paroquia) {
        this.titulo = titulo;
        this.dataHoraInicio = dataHoraInicio;
        this.descricao = descricao;
        this.paroquia = paroquia;
    }
    */
}
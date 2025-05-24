// src/main/java/com/paroquiaperto/backend/mapper/MissaMapper.java

package com.paroquiaperto.backend.mapper;

import com.paroquiaperto.backend.model.Missa;
import com.paroquiaperto.backend.model.Paroquia; // Precisamos para o relacionamento na entidade
import com.paroquiaperto.backend.dto.MissaDTO; // O DTO que criamos

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.Named; // Para métodos de mapeamento personalizados, se necessário

@Mapper(componentModel = "spring", // Diz ao MapStruct para gerar o mapper como um bean Spring
        unmappedTargetPolicy = ReportingPolicy.IGNORE, // Ignora campos não mapeados para evitar erros de compilação
        uses = { ParoquiaMapper.class }) // Indica que este mapper pode usar o ParoquiaMapper para mapeamentos complexos
public interface MissaMapper {

    // --- Mapeamento de Entidade (Missa) para DTO (MissaDTO) ---
    // Aqui, mapeamos o ID da paróquia (do objeto Paroquia dentro de Missa)
    // para o campo paroquiaId no MissaDTO.
    @Mapping(source = "paroquia.id", target = "paroquiaId")
    MissaDTO toDto(Missa missa);

    // --- Mapeamento de DTO (MissaDTO) para Entidade (Missa) ---
    // Ao converter do DTO para a Entidade, o MapStruct não sabe como criar
    // um objeto Paroquia complexo a partir de um Long paroquiaId.
    // Então, ignoramos o 'paroquia' no mapeamento e o 'id' (será gerado pelo DB).
    // O Controller/Service será responsável por buscar a Paroquia real e associá-la.
    @Mapping(target = "id", ignore = true) // O ID será gerado automaticamente para novas missas
    @Mapping(target = "paroquia", ignore = true) // A Paroquia será definida manualmente no Controller/Service
    Missa toEntity(MissaDTO missaDTO);

    // --- Método para Atualizar uma Entidade 'Missa' Existente a partir de um DTO ---
    // Este método é crucial para operações de PUT (atualização).
    // Ele copia os campos do DTO para uma instância de Entidade já existente.
    // 'id' e 'paroquia' são ignorados para não sobrescrever o ID da entidade existente
    // e para que a associação da Paroquia seja tratada separadamente no Controller.
    @Mapping(target = "id", ignore = true) // Não atualize o ID da entidade existente
    @Mapping(target = "paroquia", ignore = true) // A associação da Paroquia será tratada fora deste mapeamento
    void updateEntityFromDto(MissaDTO missaDTO, @org.mapstruct.MappingTarget Missa missa);

    // --- Método Auxiliar para Relacionamentos (Opcional, mas útil para MapStruct) ---
    // Embora a lógica de buscar a Paroquia real seja feita no Controller/Service,
    // este método ajuda o MapStruct a entender como um 'paroquiaId' no DTO
    // se relaciona a um objeto 'Paroquia' na Entidade, mesmo que ele não execute a busca aqui.
    @Named("idToParoquia")
    default Paroquia idToParoquia(Long paroquiaId) {
        // Retorna null, pois a busca real será feita pelo ParoquiaRepository no Controller/Service
        return null;
    }
}
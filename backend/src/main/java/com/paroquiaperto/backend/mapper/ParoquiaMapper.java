// src/main/java/com/paroquiaperto/backend/mapper/ParoquiaMapper.java

package com.paroquiaperto.backend.mapper;

import com.paroquiaperto.backend.model.Paroquia;
import com.paroquiaperto.backend.dto.ParoquiaDTO; // Importe o DTO que acabamos de criar

import org.mapstruct.Mapper;
import org.mapstruct.Mapping; // Necessário para mapeamentos específicos
import org.mapstruct.ReportingPolicy; // Para controle de relatórios de erros/avisos

@Mapper(componentModel = "spring", // Diz ao MapStruct para gerar o mapper como um bean Spring
        unmappedTargetPolicy = ReportingPolicy.IGNORE) // Ignora campos no DTO que não têm correspondência na Entidade (e vice-versa)
public interface ParoquiaMapper {

    // Método para converter uma Entidade 'Paroquia' para um DTO 'ParoquiaDTO'
    // MapStruct automaticamente mapeia campos com o mesmo nome (e.g., 'nome' para 'nome').
    // O @Mapping é usado aqui porque em 'Paroquia' temos 'imagemUrl' e no DTO queremos 'imageUrl' (apenas um exemplo, se forem diferentes).
    // Se o nome do campo na entidade for 'imagemUrl' e no DTO for 'imageUrl', o @Mapping é crucial.
    // Se o nome do campo for o mesmo (e.g., 'descricao' em ambos), não precisa de @Mapping explícito.
    @Mapping(source = "imagemUrl", target = "imageUrl")
    ParoquiaDTO toDto(Paroquia paroquia);

    // Método para converter um DTO 'ParoquiaDTO' de volta para uma Entidade 'Paroquia'
    // Para operações de criação (POST), o ID é gerado pelo banco de dados, então 'ignore = true'.
    // Para operações de atualização (PUT), você geralmente obtém a entidade primeiro e depois atualiza seus campos.
    @Mapping(target = "id", ignore = true) // O ID será gerado ou virá do PathVariable no PUT
    @Mapping(target = "missas", ignore = true) // Ignora listas de relacionamentos complexos no mapeamento de DTO para Entidade simples
    @Mapping(target = "eventos", ignore = true) // Isso evita problemas de 'nested' mapping se o DTO não os contiver
    @Mapping(source = "imageUrl", target = "imagemUrl")
    Paroquia toEntity(ParoquiaDTO paroquiaDTO);

    // Você também pode adicionar um método para atualizar uma entidade existente a partir de um DTO
    // Isso é útil para operações PUT, onde você quer atualizar campos de uma entidade já persistida.
    // @MappingTarget indica que 'paroquia' é a instância a ser atualizada.
    @Mapping(target = "id", ignore = true) // Não atualize o ID da entidade existente
    @Mapping(target = "missas", ignore = true) // Não mexa nas listas de relacionamentos aqui
    @Mapping(target = "eventos", ignore = true)
    @Mapping(source = "imageUrl", target = "imagemUrl")
    void updateEntityFromDto(ParoquiaDTO paroquiaDTO, @org.mapstruct.MappingTarget Paroquia paroquia);
}
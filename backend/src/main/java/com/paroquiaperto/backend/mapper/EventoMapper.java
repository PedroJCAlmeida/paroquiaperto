// src/main/java/com/paroquiaperto/backend/mapper/EventoMapper.java

package com.paroquiaperto.backend.mapper;

import com.paroquiaperto.backend.model.Evento;
import com.paroquiaperto.backend.model.Paroquia; // Precisamos para o relacionamento
import com.paroquiaperto.backend.dto.EventoDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", // Gera o mapper como um bean Spring
        unmappedTargetPolicy = ReportingPolicy.IGNORE, // Ignora campos não mapeados
        uses = { ParoquiaMapper.class }) // Pode usar ParoquiaMapper se precisar de mapeamentos de Paroquia aninhados
public interface EventoMapper {

    // --- Mapeamento de Entidade (Evento) para DTO (EventoDTO) ---
    // Mapeamos o ID da paróquia da entidade para o DTO
    @Mapping(source = "paroquia.id", target = "paroquiaId")
    EventoDTO toDto(Evento evento);

    // --- Mapeamento de DTO (EventoDTO) para Entidade (Evento) ---
    // O ID será gerado ou virá do PathVariable no PUT
    @Mapping(target = "id", ignore = true)
    // A Paróquia será setada manualmente no Controller/Service (buscando pelo ID)
    @Mapping(target = "paroquia", ignore = true)
    Evento toEntity(EventoDTO eventoDTO);

    // --- Método para Atualizar uma Entidade 'Evento' Existente a partir de um DTO ---
    // Não atualize o ID da entidade existente
    @Mapping(target = "id", ignore = true)
    // A Paróquia será tratada separadamente no Controller/Service
    @Mapping(target = "paroquia", ignore = true)
    void updateEntityFromDto(EventoDTO eventoDTO, @org.mapstruct.MappingTarget Evento evento);

    // Este método é mais para o MapStruct entender como um ID pode virar uma Paroquia,
    // mas a lógica de busca real deve estar no serviço/controlador.
    @Named("idToParoquia")
    default Paroquia idToParoquia(Long paroquiaId) {
        return null; // O controlador vai lidar com a busca real da Paróquia
    }
}
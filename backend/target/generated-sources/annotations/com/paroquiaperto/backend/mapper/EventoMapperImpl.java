package com.paroquiaperto.backend.mapper;

import com.paroquiaperto.backend.dto.EventoDTO;
import com.paroquiaperto.backend.model.Evento;
import com.paroquiaperto.backend.model.Paroquia;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-18T21:19:38+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class EventoMapperImpl implements EventoMapper {

    @Override
    public EventoDTO toDto(Evento evento) {
        if ( evento == null ) {
            return null;
        }

        EventoDTO eventoDTO = new EventoDTO();

        eventoDTO.setParoquiaId( eventoParoquiaId( evento ) );
        eventoDTO.setId( evento.getId() );
        eventoDTO.setTitulo( evento.getTitulo() );
        eventoDTO.setDescricao( evento.getDescricao() );
        eventoDTO.setDataHoraInicio( evento.getDataHoraInicio() );
        eventoDTO.setDataHoraFim( evento.getDataHoraFim() );
        eventoDTO.setLocal( evento.getLocal() );
        eventoDTO.setImagemUrl( evento.getImagemUrl() );

        return eventoDTO;
    }

    @Override
    public Evento toEntity(EventoDTO eventoDTO) {
        if ( eventoDTO == null ) {
            return null;
        }

        Evento evento = new Evento();

        evento.setTitulo( eventoDTO.getTitulo() );
        evento.setDataHoraInicio( eventoDTO.getDataHoraInicio() );
        evento.setDataHoraFim( eventoDTO.getDataHoraFim() );
        evento.setDescricao( eventoDTO.getDescricao() );
        evento.setLocal( eventoDTO.getLocal() );
        evento.setImagemUrl( eventoDTO.getImagemUrl() );

        return evento;
    }

    @Override
    public void updateEntityFromDto(EventoDTO eventoDTO, Evento evento) {
        if ( eventoDTO == null ) {
            return;
        }

        evento.setTitulo( eventoDTO.getTitulo() );
        evento.setDataHoraInicio( eventoDTO.getDataHoraInicio() );
        evento.setDataHoraFim( eventoDTO.getDataHoraFim() );
        evento.setDescricao( eventoDTO.getDescricao() );
        evento.setLocal( eventoDTO.getLocal() );
        evento.setImagemUrl( eventoDTO.getImagemUrl() );
    }

    private Long eventoParoquiaId(Evento evento) {
        if ( evento == null ) {
            return null;
        }
        Paroquia paroquia = evento.getParoquia();
        if ( paroquia == null ) {
            return null;
        }
        Long id = paroquia.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}

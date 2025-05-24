package com.paroquiaperto.backend.mapper;

import com.paroquiaperto.backend.dto.ParoquiaDTO;
import com.paroquiaperto.backend.model.Paroquia;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-24T23:05:03+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Azul Systems, Inc.)"
)
@Component
public class ParoquiaMapperImpl implements ParoquiaMapper {

    @Override
    public ParoquiaDTO toDto(Paroquia paroquia) {
        if ( paroquia == null ) {
            return null;
        }

        ParoquiaDTO paroquiaDTO = new ParoquiaDTO();

        paroquiaDTO.setImageUrl( paroquia.getImagemUrl() );
        paroquiaDTO.setId( paroquia.getId() );
        paroquiaDTO.setNome( paroquia.getNome() );
        paroquiaDTO.setEndereco( paroquia.getEndereco() );
        paroquiaDTO.setDescricao( paroquia.getDescricao() );
        paroquiaDTO.setLatitude( paroquia.getLatitude() );
        paroquiaDTO.setLongitude( paroquia.getLongitude() );

        return paroquiaDTO;
    }

    @Override
    public Paroquia toEntity(ParoquiaDTO paroquiaDTO) {
        if ( paroquiaDTO == null ) {
            return null;
        }

        Paroquia paroquia = new Paroquia();

        paroquia.setImagemUrl( paroquiaDTO.getImageUrl() );
        paroquia.setNome( paroquiaDTO.getNome() );
        paroquia.setEndereco( paroquiaDTO.getEndereco() );
        if ( paroquiaDTO.getLatitude() != null ) {
            paroquia.setLatitude( paroquiaDTO.getLatitude() );
        }
        if ( paroquiaDTO.getLongitude() != null ) {
            paroquia.setLongitude( paroquiaDTO.getLongitude() );
        }
        paroquia.setDescricao( paroquiaDTO.getDescricao() );

        return paroquia;
    }

    @Override
    public void updateEntityFromDto(ParoquiaDTO paroquiaDTO, Paroquia paroquia) {
        if ( paroquiaDTO == null ) {
            return;
        }

        paroquia.setImagemUrl( paroquiaDTO.getImageUrl() );
        paroquia.setNome( paroquiaDTO.getNome() );
        paroquia.setEndereco( paroquiaDTO.getEndereco() );
        if ( paroquiaDTO.getLatitude() != null ) {
            paroquia.setLatitude( paroquiaDTO.getLatitude() );
        }
        if ( paroquiaDTO.getLongitude() != null ) {
            paroquia.setLongitude( paroquiaDTO.getLongitude() );
        }
        paroquia.setDescricao( paroquiaDTO.getDescricao() );
    }
}

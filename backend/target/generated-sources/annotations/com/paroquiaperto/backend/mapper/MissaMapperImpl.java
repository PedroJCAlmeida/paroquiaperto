package com.paroquiaperto.backend.mapper;

import com.paroquiaperto.backend.dto.MissaDTO;
import com.paroquiaperto.backend.model.Missa;
import com.paroquiaperto.backend.model.Paroquia;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-24T23:05:03+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Azul Systems, Inc.)"
)
@Component
public class MissaMapperImpl implements MissaMapper {

    @Override
    public MissaDTO toDto(Missa missa) {
        if ( missa == null ) {
            return null;
        }

        MissaDTO missaDTO = new MissaDTO();

        missaDTO.setParoquiaId( missaParoquiaId( missa ) );
        missaDTO.setId( missa.getId() );
        missaDTO.setHorario( missa.getHorario() );
        missaDTO.setDescricao( missa.getDescricao() );

        return missaDTO;
    }

    @Override
    public Missa toEntity(MissaDTO missaDTO) {
        if ( missaDTO == null ) {
            return null;
        }

        Missa missa = new Missa();

        missa.setHorario( missaDTO.getHorario() );
        missa.setDescricao( missaDTO.getDescricao() );

        return missa;
    }

    @Override
    public void updateEntityFromDto(MissaDTO missaDTO, Missa missa) {
        if ( missaDTO == null ) {
            return;
        }

        missa.setHorario( missaDTO.getHorario() );
        missa.setDescricao( missaDTO.getDescricao() );
    }

    private Long missaParoquiaId(Missa missa) {
        if ( missa == null ) {
            return null;
        }
        Paroquia paroquia = missa.getParoquia();
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

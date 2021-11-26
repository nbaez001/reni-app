package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.CuentaSistemaUsuarioSeguridadBuscarServiciosResponse;

public class CuentaSistemaUsuarioSeguridadBuscarServiciosResponseMapper
		implements RowMapper<CuentaSistemaUsuarioSeguridadBuscarServiciosResponse> {

	public CuentaSistemaUsuarioSeguridadBuscarServiciosResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		CuentaSistemaUsuarioSeguridadBuscarServiciosResponse o = new CuentaSistemaUsuarioSeguridadBuscarServiciosResponse();
		o.setIdServicio(rs.getLong("NID_SERVICIO"));
		return o;
	}

}

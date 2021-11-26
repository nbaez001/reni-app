package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.CentroAtencionCargaMasivaCentroListarResponse;

public class CentroAtencionCargaMasivaCentroListarResponseMapper
		implements RowMapper<CentroAtencionCargaMasivaCentroListarResponse> {

	public CentroAtencionCargaMasivaCentroListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		CentroAtencionCargaMasivaCentroListarResponse o = new CentroAtencionCargaMasivaCentroListarResponse();
		o.setIdCentroAtencion(rs.getLong("NID_CENTRO_ATEN"));
		o.setCodCentroAtencion(rs.getString("TXT_CODIGO"));
		return o;
	}

}

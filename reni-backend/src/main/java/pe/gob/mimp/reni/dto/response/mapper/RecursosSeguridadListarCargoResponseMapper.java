package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.RecursosSeguridadListarCargoResponse;

public class RecursosSeguridadListarCargoResponseMapper implements RowMapper<RecursosSeguridadListarCargoResponse> {

	public RecursosSeguridadListarCargoResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		RecursosSeguridadListarCargoResponse o = new RecursosSeguridadListarCargoResponse();
		o.setIdCargo(rs.getLong("NID_CARGO"));
		o.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

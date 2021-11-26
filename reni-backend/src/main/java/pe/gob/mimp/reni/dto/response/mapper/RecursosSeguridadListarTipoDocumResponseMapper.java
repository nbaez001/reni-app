package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.RecursosSeguridadListarTipoDocumResponse;

public class RecursosSeguridadListarTipoDocumResponseMapper
		implements RowMapper<RecursosSeguridadListarTipoDocumResponse> {

	public RecursosSeguridadListarTipoDocumResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		RecursosSeguridadListarTipoDocumResponse o = new RecursosSeguridadListarTipoDocumResponse();
		o.setIdTipoDocumento(rs.getLong("NID_TIPO_DOCUMENTO"));
		o.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

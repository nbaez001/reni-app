package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.EdneListarUsuarioXDocumentoResponse;

public class EdneListarUsuarioXDocumentoResponseMapper implements RowMapper<EdneListarUsuarioXDocumentoResponse> {

	public EdneListarUsuarioXDocumentoResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		EdneListarUsuarioXDocumentoResponse o = new EdneListarUsuarioXDocumentoResponse();
		o.setIdUsuario(rs.getLong("NID_USUARIO"));
		o.setNroDocumento(rs.getString("NRO_DOC_USU"));
		o.setTipDocumento(rs.getString("TIP_DOC_USU"));
		return o;
	}

}

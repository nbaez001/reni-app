package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.EdneListarUsuarioXCodigoResponse;

public class EdneListarUsuarioXCodigoResponseMapper implements RowMapper<EdneListarUsuarioXCodigoResponse> {

	public EdneListarUsuarioXCodigoResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		EdneListarUsuarioXCodigoResponse o = new EdneListarUsuarioXCodigoResponse();
		o.setIdUsuario(rs.getLong("NID_USUARIO"));
		o.setCodUsuario(rs.getString("COD_USU"));
		return o;
	}

}

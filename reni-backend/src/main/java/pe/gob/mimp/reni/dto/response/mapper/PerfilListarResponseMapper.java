package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.PerfilListarResponse;

public class PerfilListarResponseMapper implements RowMapper<PerfilListarResponse> {

	public PerfilListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		PerfilListarResponse o = new PerfilListarResponse();
		o.setIdPerfil(rs.getLong("NID_PERFIL"));
		o.setIdModulo(rs.getLong("NID_MODULO"));
		o.setNombre(rs.getString("TXT_PERFIL"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

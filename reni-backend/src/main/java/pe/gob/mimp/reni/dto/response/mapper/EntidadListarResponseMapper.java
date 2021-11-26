package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.EntidadListarResponse;

public class EntidadListarResponseMapper implements RowMapper<EntidadListarResponse> {

	public EntidadListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		EntidadListarResponse o = new EntidadListarResponse();
		o.setIdEntidad(rs.getLong("NID_ENTIDAD"));
		o.setIdAreaSeguridad(rs.getLong("NID_AREA_SEGURIDAD"));
		o.setCodigo(rs.getString("TXT_CODIGO"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		o.setSiglas(rs.getString("TXT_SIGLAS"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

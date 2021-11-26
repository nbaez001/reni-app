package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.AreaListarResponse;

public class AreaListarResponseMapper implements RowMapper<AreaListarResponse> {

	public AreaListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		AreaListarResponse c = new AreaListarResponse();
		c.setIdArea(rs.getLong("NID_AREA"));
		c.setNombre(rs.getString("TXT_AREA"));
		c.setSigla(rs.getString("TXT_SIGLA"));
		c.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return c;
	}

}

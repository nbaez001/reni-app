package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.BDTablaListarResponse;

public class BDTablaListarResponseMapper implements RowMapper<BDTablaListarResponse> {

	public BDTablaListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		BDTablaListarResponse o = new BDTablaListarResponse();
		o.setNomTabla(rs.getString("TABLE_NAME"));
		return o;
	}

}

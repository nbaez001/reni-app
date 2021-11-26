package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.MaestraCargaMasivaListarMaeResponse;

public class MaestraCargaMasivaListarMaeResponseMapper implements RowMapper<MaestraCargaMasivaListarMaeResponse> {

	public MaestraCargaMasivaListarMaeResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		MaestraCargaMasivaListarMaeResponse o = new MaestraCargaMasivaListarMaeResponse();
		o.setIdMaestra(rs.getLong("NID_MAESTRA"));
		o.setIdTabla(rs.getString("TXT_ID_TABLA"));
		return o;
	}

}

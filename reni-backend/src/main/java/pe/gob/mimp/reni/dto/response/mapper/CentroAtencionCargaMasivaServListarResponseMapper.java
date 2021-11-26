package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.CentroAtencionCargaMasivaServListarResponse;

public class CentroAtencionCargaMasivaServListarResponseMapper
		implements RowMapper<CentroAtencionCargaMasivaServListarResponse> {

	public CentroAtencionCargaMasivaServListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		CentroAtencionCargaMasivaServListarResponse o = new CentroAtencionCargaMasivaServListarResponse();
		o.setIdServicio(rs.getLong("NID_SERVICIO"));
		o.setCodServicio(rs.getString("TXT_CODIGO"));
		return o;
	}

}

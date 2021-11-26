package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.CentroAtencionServListarXCentroResponse;

public class CentroAtencionServListarXCentroResponseMapper
		implements RowMapper<CentroAtencionServListarXCentroResponse> {

	public CentroAtencionServListarXCentroResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		CentroAtencionServListarXCentroResponse o = new CentroAtencionServListarXCentroResponse();
		o.setIdCentroAtenServicio(rs.getLong("NID_CENTRO_ATEN_SERVICIO"));
		o.setIdServicio(rs.getLong("NID_SERVICIO"));
		o.setCodigo(rs.getString("TXT_CODIGO"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		return o;
	}

}

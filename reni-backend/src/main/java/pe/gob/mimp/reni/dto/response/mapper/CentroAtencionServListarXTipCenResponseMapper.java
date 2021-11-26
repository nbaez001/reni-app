package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.CentroAtencionServListarXTipCenResponse;

public class CentroAtencionServListarXTipCenResponseMapper
		implements RowMapper<CentroAtencionServListarXTipCenResponse> {

	public CentroAtencionServListarXTipCenResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		CentroAtencionServListarXTipCenResponse o = new CentroAtencionServListarXTipCenResponse();
		o.setIdServicio(rs.getLong("NID_SERVICIO"));
		o.setCodigo(rs.getString("TXT_CODIGO"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		return o;
	}

}

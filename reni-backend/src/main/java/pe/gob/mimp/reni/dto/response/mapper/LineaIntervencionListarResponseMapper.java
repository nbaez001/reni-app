package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.LineaIntervencionListarResponse;

public class LineaIntervencionListarResponseMapper implements RowMapper<LineaIntervencionListarResponse> {

	public LineaIntervencionListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		LineaIntervencionListarResponse o = new LineaIntervencionListarResponse();
		o.setIdLineaInter(rs.getLong("NID_LINEA_INTER"));
		o.setCodigo(rs.getString("TXT_CODIGO"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		o.setOrden(rs.getInt("NUM_ORDEN"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.BDCampoTablaListarResponse;

public class BDCampoTablaListarResponseMapper implements RowMapper<BDCampoTablaListarResponse> {

	public BDCampoTablaListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		BDCampoTablaListarResponse o = new BDCampoTablaListarResponse();
		o.setNomColumna(rs.getString("COLUMN_NAME"));
		o.setTipoDato(rs.getString("DATA_TYPE"));
		o.setLongitudDato(rs.getInt("DATA_LENGTH"));
		o.setPrecisionDato(rs.getInt("DATA_PRECISION"));
		o.setEscalaDato(rs.getInt("DATA_SCALE"));
		return o;
	}

}

package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.MaestraListarResponse;

public class MaestraListarResponseMapper implements RowMapper<MaestraListarResponse> {

	public MaestraListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		MaestraListarResponse o = new MaestraListarResponse();
		o.setIdMaestra(rs.getLong("NID_MAESTRA"));
		o.setIdTabla(rs.getString("TXT_ID_TABLA"));
		o.setCodigo(rs.getString("TXT_CODIGO"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		o.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

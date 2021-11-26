package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.MaestraSubitemListarResponse;

public class MaestraSubitemListarResponseMapper implements RowMapper<MaestraSubitemListarResponse> {

	public MaestraSubitemListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		MaestraSubitemListarResponse o = new MaestraSubitemListarResponse();
		o.setIdMaestra(rs.getLong("NID_MAESTRA"));
		o.setCodigo(rs.getString("TXT_CODIGO"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		o.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		o.setOrden(rs.getInt("NUM_ORDEN"));
		return o;
	}
}

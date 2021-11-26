package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.MaestraListarExportResponse;

public class MaestraListarExportResponseMapper implements RowMapper<MaestraListarExportResponse> {

	public MaestraListarExportResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		MaestraListarExportResponse o = new MaestraListarExportResponse();
		o.setIdMaestra(rs.getLong("NID_MAESTRA"));
		o.setIdTabla(rs.getString("TXT_ID_TABLA"));
		o.setNumOrden(rs.getInt("NUM_ORDEN"));
		o.setCodigo(rs.getString("TXT_CODIGO"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		o.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

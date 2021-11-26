package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarMaestraResponse;

public class ReporteIntervencionListarMaestraResponseMapper implements RowMapper<ReporteIntervencionListarMaestraResponse> {

	public ReporteIntervencionListarMaestraResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		ReporteIntervencionListarMaestraResponse o = new ReporteIntervencionListarMaestraResponse();
		o.setIdTabla(rs.getString("TXT_ID_TABLA"));
		o.setCodigo(rs.getString("TXT_CODIGO"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		o.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		return o;
	}

}

package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarParametroResponse;

public class ReporteIntervencionListarParametroResponseMapper
		implements RowMapper<ReporteIntervencionListarParametroResponse> {

	public ReporteIntervencionListarParametroResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		ReporteIntervencionListarParametroResponse o = new ReporteIntervencionListarParametroResponse();
		o.setNomCampoExcel(rs.getString("TXT_NOM_CAMPO_EXCEL"));
		o.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		o.setDescripcionMaestra(rs.getString("TXT_DESCRIPCION_MAESTRA"));
		o.setOrdenCampoExcel(rs.getInt("NUM_ORDEN_CAMPO_EXCEL"));
		o.setCampoEsFk(rs.getInt("NUM_CAMPO_ES_FK"));
		o.setCampoIdmaestra(rs.getString("TXT_CAMPO_ID_MAESTRA"));
		o.setNomServicio(rs.getString("TXT_NOMBRE"));
		return o;
	}

}

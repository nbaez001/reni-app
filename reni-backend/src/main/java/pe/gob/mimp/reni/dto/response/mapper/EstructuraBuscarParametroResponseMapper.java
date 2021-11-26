package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.EstructuraBuscarParametroResponse;

public class EstructuraBuscarParametroResponseMapper implements RowMapper<EstructuraBuscarParametroResponse> {

	public EstructuraBuscarParametroResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		EstructuraBuscarParametroResponse o = new EstructuraBuscarParametroResponse();
		o.setIdParametro(rs.getLong("NID_PARAMETRO"));
		o.setNomCampoExcel(rs.getString("TXT_NOM_CAMPO_EXCEL"));
		o.setOrdenCampoExcel(rs.getInt("NUM_ORDEN_CAMPO_EXCEL"));
		o.setNomTablaBd(rs.getString("TXT_NOM_TABLA_BD"));
		o.setNomCampoBd(rs.getString("TXT_NOM_CAMPO_BD"));
		o.setCampoEsFk(rs.getInt("NUM_CAMPO_ES_FK"));
		o.setCampoIdMaestra(rs.getString("TXT_CAMPO_ID_MAESTRA"));
		o.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		return o;
	}

}

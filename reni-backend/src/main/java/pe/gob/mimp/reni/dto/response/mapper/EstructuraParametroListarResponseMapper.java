package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.EstructuraParametroListarResponse;

public class EstructuraParametroListarResponseMapper implements RowMapper<EstructuraParametroListarResponse> {

	public EstructuraParametroListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		EstructuraParametroListarResponse o = new EstructuraParametroListarResponse();
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

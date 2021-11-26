package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.EstructuraListarResponse;

public class EstructuraListarResponseMapper implements RowMapper<EstructuraListarResponse> {

	public EstructuraListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		EstructuraListarResponse o = new EstructuraListarResponse();
		o.setIdEstructura(rs.getLong("NID_ESTRUCTURA"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		o.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		o.setIdServicio(rs.getLong("NID_SERVICIO"));
		o.setNomServicio(rs.getString("NOM_SERVICIO"));
		o.setIdEntidad(rs.getLong("NID_ENTIDAD"));
		o.setNomEntidad(rs.getString("NOM_ENTIDAD"));
		o.setIdLineaIntervencion(rs.getLong("NID_LINEA_INTER"));
		o.setNomLineaIntervencion(rs.getString("NOM_LINEA_INTER"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

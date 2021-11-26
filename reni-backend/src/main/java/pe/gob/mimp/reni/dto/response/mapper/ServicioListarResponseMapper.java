package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.ServicioListarResponse;

public class ServicioListarResponseMapper implements RowMapper<ServicioListarResponse> {

	public ServicioListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		ServicioListarResponse o = new ServicioListarResponse();
		o.setIdServicio(rs.getLong("NID_SERVICIO"));
		o.setIdtTipCentro(rs.getString("TXT_IDT_TIP_CENTRO"));
		o.setNomTipCentro(rs.getString("TXT_NOM_TIP_CENTRO"));
		o.setCodigo(rs.getString("TXT_CODIGO"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		o.setIdEntidad(rs.getLong("NID_ENTIDAD"));
		o.setNomEntidad(rs.getString("TXT_ENTIDAD"));
		o.setIdLineaIntervencion(rs.getLong("NID_LINEA_INTER"));
		o.setNomLineaIntervencion(rs.getString("TXT_LINEA_INTER"));

		return o;
	}

}

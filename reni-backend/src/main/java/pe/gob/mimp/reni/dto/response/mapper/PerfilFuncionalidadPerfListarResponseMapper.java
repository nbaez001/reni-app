package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.PerfilFuncionalidadPerfListarResponse;

public class PerfilFuncionalidadPerfListarResponseMapper implements RowMapper<PerfilFuncionalidadPerfListarResponse> {

	public PerfilFuncionalidadPerfListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		PerfilFuncionalidadPerfListarResponse o = new PerfilFuncionalidadPerfListarResponse();
		o.setIdFuncionalidad(rs.getLong("NID_FUNCIONALIDAD"));
		o.setIdFuncionalidadPadre(rs.getLong("NID_FUNCIONALIDAD_PADRE"));
		o.setTitulo(rs.getString("TXT_TITULO"));
		o.setReferencia(rs.getString("TXT_REFERENCIA"));
		o.setImagen(rs.getString("TXT_IMAGEN"));
		o.setOrden(rs.getInt("NUM_ORDEN"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

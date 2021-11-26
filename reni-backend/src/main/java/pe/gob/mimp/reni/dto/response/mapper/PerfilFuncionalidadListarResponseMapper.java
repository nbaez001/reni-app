package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.PerfilFuncionalidadListarResponse;

public class PerfilFuncionalidadListarResponseMapper implements RowMapper<PerfilFuncionalidadListarResponse> {

	public PerfilFuncionalidadListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		PerfilFuncionalidadListarResponse o = new PerfilFuncionalidadListarResponse();
		o.setIdFuncionalidad(rs.getLong("NID_FUNCIONALIDAD"));
		o.setIdFuncionalidadPadre(rs.getLong("NID_FUNCIONALIDAD_PADRE"));
		o.setTitulo(rs.getString("TXT_TITULO"));
		o.setReferencia(rs.getString("TXT_REFERENCIA"));
		return o;
	}

}

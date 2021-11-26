package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.FuncionalidadListarResponse;

public class FuncionalidadListarResponseMapper implements RowMapper<FuncionalidadListarResponse> {

	public FuncionalidadListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		FuncionalidadListarResponse c = new FuncionalidadListarResponse();
		c.setIdFuncionalidad(rs.getLong("NID_FUNCIONALIDAD"));
		c.setIdFuncionalidadPadre(rs.getLong("NID_FUNCIONALIDAD_PADRE"));
		c.setTitulo(rs.getString("TXT_TITULO"));
		c.setReferencia(rs.getString("TXT_REFERENCIA"));
		c.setImagen(rs.getString("TXT_IMAGEN"));
		c.setOrden(rs.getInt("NUM_ORDEN"));
		c.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return c;
	}

}

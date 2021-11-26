package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarEstructuraPermitidoResponse;

public class ReporteIntervencionListarEstructuraPermitidoResponseMapper
		implements RowMapper<ReporteIntervencionListarEstructuraPermitidoResponse> {

	public ReporteIntervencionListarEstructuraPermitidoResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		ReporteIntervencionListarEstructuraPermitidoResponse o = new ReporteIntervencionListarEstructuraPermitidoResponse();
		o.setIdEstructura(rs.getLong("NID_ESTRUCTURA"));
		o.setNombre(rs.getString("TXT_NOMBRE"));
		o.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		o.setIdServicio(rs.getLong("NID_SERVICIO"));
		o.setNomServicio(rs.getString("NOM_SERVICIO"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

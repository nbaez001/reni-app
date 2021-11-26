package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.UbigeoDepartamentoListarResponse;

public class UbigeoDepartamentoListarResponseMapper implements RowMapper<UbigeoDepartamentoListarResponse> {

	@Override
	public UbigeoDepartamentoListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		UbigeoDepartamentoListarResponse p = new UbigeoDepartamentoListarResponse();
		p.setIdDepartamento(rs.getInt("NID_DEPARTAMENTO"));
		p.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		p.setUbigeoInei(rs.getString("INEI"));
		p.setUbigeoReniec(rs.getString("RENIEC"));
		p.setFlagActivo(rs.getInt("FLG_ACTIVO"));
		return p;
	}

}
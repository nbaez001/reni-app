package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.UbigeoDistritoListarResponse;

public class UbigeoDistritoListarResponseMapper implements RowMapper<UbigeoDistritoListarResponse> {

	@Override
	public UbigeoDistritoListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		UbigeoDistritoListarResponse p = new UbigeoDistritoListarResponse();
		p.setIdDistrito(rs.getInt("NID_DISTRITO"));
		p.setIdProvincia(rs.getInt("NID_PROVINCIA"));
		p.setDescripcion(rs.getString("TXT_DESCRIPCION"));
		p.setUbigeoInei(rs.getString("INEI"));
		p.setUbigeoReniec(rs.getString("RENIEC"));
		p.setFlagActivo(rs.getInt("FLG_ACTIVO"));
		return p;
	}

}
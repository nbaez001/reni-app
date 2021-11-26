package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.EdneListarResponse;

public class EdneListarResponseMapper implements RowMapper<EdneListarResponse> {

	public EdneListarResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		EdneListarResponse o = new EdneListarResponse();
		o.setIdEdne(rs.getLong("NID_EDNE"));
		o.setNomArchivo(rs.getString("TXT_NOMBRE_ARCHIVO"));
		o.setFecImportacion(rs.getDate("FEC_IMPORTACION"));
		o.setFecPeriodo(rs.getDate("FEC_PERIODO"));
		o.setIdEstructura(rs.getLong("NID_ESTRUCTURA"));
		o.setNomEstructura(rs.getString("NOM_ESTRUCTURA"));
		o.setIdServicio(rs.getLong("NID_SERVICIO"));
		o.setNomServicio(rs.getString("NOM_SERVICIO"));
		o.setIdEntidad(rs.getLong("NID_ENTIDAD"));
		o.setNomEntidad(rs.getString("NOM_ENTIDAD"));
		o.setIdLineaInter(rs.getLong("NID_LINEA_INTER"));
		o.setNomLineaInter(rs.getString("NOM_LINEA_INTER"));
		o.setIdtEstado(rs.getString("TXT_IDT_ESTADO"));
		o.setNomEstado(rs.getString("NOM_ESTADO"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

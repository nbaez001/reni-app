package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarUsuarioXDatosResponse;

public class ReporteIntervencionListarUsuarioXDatosResponseMapper
		implements RowMapper<ReporteIntervencionListarUsuarioXDatosResponse> {

	public ReporteIntervencionListarUsuarioXDatosResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
		ReporteIntervencionListarUsuarioXDatosResponse o = new ReporteIntervencionListarUsuarioXDatosResponse();
		o.setIdUsuario(rs.getLong("NID_USUARIO"));
		o.setCodUsuario(rs.getString("COD_USUARIO"));
		o.setCodDisociacion(rs.getString("COD_DISOC"));
		o.setTieneDocIdent(rs.getString("TIE_DOC_IDE"));
		o.setTipDocumento(rs.getString("TIP_DOC_USU"));
		o.setNroDocumento(rs.getString("NRO_DOC_USU"));
		o.setNombre(rs.getString("NOM_USU"));
		o.setApePaterno(rs.getString("APE_PAT_USU"));
		o.setApeMaterno(rs.getString("APE_MAT_USU"));
		o.setSexo(rs.getString("SEX_USU"));
		o.setFecNacimiento(rs.getDate("FEC_NAC_USU"));
		o.setFlgActivo(rs.getInt("FLG_ACTIVO"));
		return o;
	}

}

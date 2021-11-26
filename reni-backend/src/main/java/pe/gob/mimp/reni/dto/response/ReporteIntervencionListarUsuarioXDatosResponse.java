package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReporteIntervencionListarUsuarioXDatosResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idUsuario;
	private String codUsuario;
	private String codDisociacion;
	private String tieneDocIdent;
	private String tipDocumento;
	private String nroDocumento;
	private String nombre;
	private String apePaterno;
	private String apeMaterno;
	private String sexo;
	private Date fecNacimiento;
	private Integer flgActivo;
}

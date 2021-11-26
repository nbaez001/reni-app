package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UsuarioModificarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idUsuario;
	private String idtTieneDocIdent;
	private String idtTipoDocumento;
	private String nroDocumento;
	private String nombre;
	private String apePaterno;
	private String apeMaterno;
	private String sexo;
	private Date fecNacimiento;
	private Long idUsuarioModif;
}

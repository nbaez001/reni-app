package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CuentaSistemaBuscarPersonaResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idPersona;
	private String nombres;
	private String apePaterno;
	private String apeMaterno;
	private Date fecNacimiento;
	private String sexo;
	private Long idArea;
	private String nomArea;
	private Long idCargo;
	private Long idUsuario;
	private String usuario;
	private Long idPerfil;
}

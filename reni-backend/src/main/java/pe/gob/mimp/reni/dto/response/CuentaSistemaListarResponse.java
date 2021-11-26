package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CuentaSistemaListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idUsuario;
	private String usuario;
	private Long idPerfil;
	private String nomPerfil;
	private Long idTipoDocumento;
	private String nomTipoDocumento;
	private String nroDocumento;
	private String apePaterno;
	private String apeMaterno;
	private String nombre;
	private Long idArea;
	private String nomArea;
	private Long idCargo;
	private String nomCargo;
	private Date fecNacimiento;
	private String sexo;
	private Integer flgActivo;
}

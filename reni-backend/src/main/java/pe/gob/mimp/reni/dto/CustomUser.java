package pe.gob.mimp.reni.dto;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CustomUser implements Serializable {
	private static final long serialVersionUID = 1L;

	private String username;
	private Long idUsuario;
	private Long idModulo;
	private Long idPersona;
	private Long idTipDocumento;
	private String nomTipDocumento;
	private String nroDocumento;
	private String apePaterno;
	private String apeMaterno;
	private String nombres;
	private Long idCargo;
	private String nomCargo;
	private Long idArea;
	private String nomArea;
	private Long idPerfil;
	private String nomPerfil;

	public CustomUser(String username, String nombres) {
		this.username = username;
		this.nombres = nombres;
	}
}

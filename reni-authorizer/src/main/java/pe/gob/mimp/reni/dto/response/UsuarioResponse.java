package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UsuarioResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idUsuario;
	private Long idModulo;
	private String username;
	private String password;
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

	private Collection<GrantedAuthority> grantedAuthoritiesList = new ArrayList<>();

}

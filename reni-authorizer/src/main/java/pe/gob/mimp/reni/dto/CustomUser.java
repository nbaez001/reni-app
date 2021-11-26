package pe.gob.mimp.reni.dto;

import org.springframework.security.core.userdetails.User;

import lombok.Setter;
import pe.gob.mimp.reni.dto.response.UsuarioResponse;
import lombok.Getter;

@Getter
@Setter
public class CustomUser extends User {
	private static final long serialVersionUID = 1L;

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

	public CustomUser(UsuarioResponse user) {
		super(user.getUsername(), user.getPassword(), user.getGrantedAuthoritiesList());
		this.idUsuario = user.getIdUsuario();
		this.idModulo = user.getIdModulo();
		this.idPersona = user.getIdPersona();
		this.idTipDocumento = user.getIdTipDocumento();
		this.nomTipDocumento = user.getNomTipDocumento();
		this.nroDocumento = user.getNroDocumento();
		this.apePaterno = user.getApePaterno();
		this.apeMaterno = user.getApeMaterno();
		this.nombres = user.getNombres();
		this.idCargo = user.getIdCargo();
		this.nomCargo = user.getNomCargo();
		this.idArea = user.getIdArea();
		this.nomArea = user.getNomArea();
		this.idPerfil = user.getIdPerfil();
		this.nomPerfil = user.getNomPerfil();
	}

}

package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CuentaSistemaModificarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idUsuario;
	private String nombres;
	private String apePaterno;
	private String apeMaterno;
	private Date fecNacimiento;
	private String sexo;
	private Long idArea;
	private Long idCargo;
	private String usuario;
	private String contrasenia;
	private Long idPerfil;
	private Long idUsuarioModif;
	private List<Long> listaServicios;
	private Integer flgReporteDisociado;
}

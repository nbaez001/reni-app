package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CentroAtencionModificarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idCentroAtencion;
	private String nombre;
	private String codigo;
	private Date fechaCreacion;
	private String idtTipoCentro;
	private String idtSubtipoCentro;
	private String ubigeo;
	private String departamento;
	private String provincia;
	private String distrito;
	private String direccion;
	private String refDireccion;
	private String areaResid;
	private Integer flgTieneTelef;
	private Integer flgTieneLuz;
	private Integer flgTieneAgua;
	private Integer flgTieneDesague;
	private Integer capacidadMaxima;
	private Long idTipDocRepres;
	private String nroDocRepres;
	private String nombreRepres;
	private String apePaternoRepres;
	private String apeMaternoRepres;
	private String nroTelefono;
	private String tipoCoordenada;
	private String coordenadaX;
	private String coordenadaY;
	private Integer flgActivo;
	private Long idUsuarioModif;

}

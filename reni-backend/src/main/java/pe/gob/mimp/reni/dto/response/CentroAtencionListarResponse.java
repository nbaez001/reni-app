package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CentroAtencionListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idCentroAtencion;
	private String idtTipoCentro;
	private String nomTipoCentro;
	private String idtSubtipoCentro;
	private String nomSubtipoCentro;
	private String codigo;
	private String nombre;
	private Date fechaCreacion;
	private String ubigeo;
	private String nomDepartamento;
	private String nomProvincia;
	private String nomDistrito;
	private String direccion;
	private String refDireccion;
	private String areaResid;
	private Integer flgTieneTelef;
	private Integer flgTieneLuz;
	private Integer flgTieneAgua;
	private Integer flgTieneDesague;
	private Integer capacidadMaxima;
	private Long idTipDocRepres;
	private String nomTipDocRepres;
	private String nroDocRepres;
	private String nombreRepres;
	private String apePaternoRepres;
	private String apeMaternoRepres;
	private String nroTelefono;
	private String tipoCoordenada;
	private String coordenadaX;
	private String coordenadaY;
	private Integer flgActivo;
}

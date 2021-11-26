package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.ToString;

import lombok.Setter;

import lombok.Getter;

@Getter
@Setter
@ToString
public class ReporteIntervencionListarEstructuraPermitidoResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idEstructura;
	private String nombre;
	private String descripcion;
	private Long idServicio;
	private String nomServicio;
	private Integer flgActivo;

}

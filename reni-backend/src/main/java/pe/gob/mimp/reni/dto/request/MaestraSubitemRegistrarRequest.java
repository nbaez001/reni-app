package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.ToString;

import lombok.Setter;

import lombok.Getter;

@Getter
@Setter
@ToString
public class MaestraSubitemRegistrarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String idTabla;
	private Long idMaestraPadre;
	private String codigo;
	private String nombre;
	private String descripcion;
	private Integer orden;
	private Long idUsuarioCrea;

}

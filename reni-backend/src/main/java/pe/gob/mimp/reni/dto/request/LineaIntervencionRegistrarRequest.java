package pe.gob.mimp.reni.dto.request;

import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

import lombok.Getter;

@Getter
@Setter
@ToString
public class LineaIntervencionRegistrarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String nombre;
	private String codigo;
	private Integer orden;
	private Long idUsuarioCrea;
}

package pe.gob.mimp.reni.dto.response;

import lombok.ToString;

import lombok.Setter;

import java.io.Serializable;

import lombok.Getter;

@Getter
@Setter
@ToString
public class AreaBuscarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idArea;
	private String nombre;
	private String sigla;
	private Integer flgActivo;
}

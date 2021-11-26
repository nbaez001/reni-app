package pe.gob.mimp.reni.dto.response;

import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

import lombok.Getter;

@Getter
@Setter
@ToString
public class EntidadRegistrarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idEntidad;
}

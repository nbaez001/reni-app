package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AreaListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idArea;
	private String nombre;
	private String sigla;
	private Integer flgActivo;
}

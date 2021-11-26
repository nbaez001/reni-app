package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OutResponse<T> implements Serializable {

	private static final long serialVersionUID = 1L;
	private Integer rCodigo;
	private String rMensaje;
	private T objeto;
	private Long length;
}

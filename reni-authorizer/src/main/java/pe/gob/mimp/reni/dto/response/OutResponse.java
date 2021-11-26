package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.ToString;

import lombok.Setter;

import lombok.Getter;

@Getter
@Setter
@ToString
public class OutResponse<T> implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer rCodigo;
	private String rMensaje;
	private T objeto;

}

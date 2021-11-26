package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.ToString;

import lombok.Setter;

import lombok.Getter;

@Getter
@Setter
@ToString
public class UbigeoDistritoListarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Integer idProvincia;
}

package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Setter;
import lombok.ToString;
import lombok.Getter;

@Getter
@Setter
@ToString
public class UbigeoDistritoListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer idDistrito;
	private Integer idProvincia;
	private String descripcion;
	private String ubigeoInei;
	private String ubigeoReniec;
	private Integer flagActivo;

}

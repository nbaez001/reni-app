package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UbigeoDepartamentoListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer idDepartamento;
	private String descripcion;
	private String ubigeoInei;
	private String ubigeoReniec;
	private Integer flagActivo;

}

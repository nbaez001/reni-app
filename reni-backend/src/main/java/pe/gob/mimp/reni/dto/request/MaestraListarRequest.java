package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class MaestraListarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Integer flgActivo;
	private String nombre;
//	private Long index;
//	private Long size;
//	private Long length;
}

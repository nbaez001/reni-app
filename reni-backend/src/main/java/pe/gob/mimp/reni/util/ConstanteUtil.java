package pe.gob.mimp.reni.util;

public class ConstanteUtil {
	public static final String BD_SCHEMA_RENI = "RENI";
	public static final String BD_PKG_RENI_MAESTRA = "PKG_RENI_MAESTRA";
	public static final String BD_PKG_RENI_ENTIDAD = "PKG_RENI_ENTIDAD";
	public static final String BD_PKG_RENI_LINEA_INTER = "PKG_RENI_LINEA_INTER";
	public static final String BD_PKG_RENI_SERVICIO = "PKG_RENI_SERVICIO";
	public static final String BD_PKG_RENI_CENTRO_ATENCION = "PKG_RENI_CENTRO_ATENCION";
	public static final String BD_PKG_RENI_ESTRUCTURA = "PKG_RENI_ESTRUCTURA";
	public static final String BD_PKG_RENI_ADMIN_BD = "PKG_RENI_ADMIN_BD";
	public static final String BD_PKG_RENI_EDNE = "PKG_RENI_EDNE";
	public static final String BD_PKG_RENI_REPORTE = "PKG_RENI_REPORTE";
	public static final String BD_PKG_RENI_CUENTA_SISTEMA = "PKG_RENI_CUENTA_SISTEMA";
	public static final String BD_PKG_RENI_USUARIO = "PKG_RENI_USUARIO";
	public static final String BD_PKG_RENI_TIPO_CENTRO = "PKG_RENI_TIPO_CENTRO";

	public static final String BD_SCHEMA_GENERAL = "GENERAL";
	public static final String BD_PKG_RENI_UBIGEO = "PKG_RENI_UBIGEO";

	public static final String BD_SCHEMA_SEGURIDAD = "SEGURIDAD";
	public static final String BD_PKG_RENI_AUTENTICACION = "PKG_RENI_AUTENTICACION";
	public static final String BD_PKG_RENI_RECURSOS = "PKG_RENI_RECURSOS";

	public static final String R_CODIGO = "R_CODIGO";
	public static final String R_MENSAJE = "R_MENSAJE";
	public static final String R_LISTA = "R_LISTA";

	public static final Integer R_COD_EXITO = 0;

	public static final Integer FLG_ACTVO = 1;
	public static final Integer FLG_INACTVO = 0;
	public static final String DESC_ACTIVO = "ACTIVO";
	public static final String DESC_INACTIVO = "INACTIVO";

	public static final String slash_ddMMyyyy = "dd/MM/yyyy";
	public static final String slash_ddMMyy = "dd/MM/yy";
	public static final String guion_ddMMyyyy = "dd-MM-yyyy";
	public static final String guion_yyyyMMdd = "yyyy-MM-dd";
	public static final String date_espacio_MMMyyyy = "MMM yyyy";

	public static final char separadorPunto = '.';
	public static final char separadorComa = '.';
	public static final String formato1Decimal = "0.0";
	public static final String formato2Decimal = "0.00";

	// PARA OBTENER IP MAQUINA
	public static final String X_FORWARDED_FOR = "X-FORWARDED-FOR";

	// TIPOS DE DATOS PARA MAPEO
	public static final String T_VARCHAR2 = "VARCHAR2";
	public static final String T_NUMBER = "NUMBER";
	public static final String T_DATE = "DATE";

	// PERFILES
	public static final String PERFIL_DEV = "dev";
	public static final String PERFIL_QA = "qa";
	public static final String PERFIL_PRD = "prd";

	// CAMPOS DE BASE DE DATOS
	public static final String TB_ENTIDAD = "ENTIDAD";
	public static final String TB_ENTIDAD_PREFIJO = "E";
	public static final String TB_ENTIDAD_CAMPO_NID_ENTIDAD = "NID_ENTIDAD";

	public static final String TB_LINEA_INTERVENCION = "LINEA_INTERVENCION";
	public static final String TB_LINEA_INTERVENCION_PREFIJO = "LI";
	public static final String TB_LINEA_INTERVENCION_CAMPO_NID_LINEA_INTER = "NID_LINEA_INTER";

	public static final String TB_SERVICIO = "SERVICIO";
	public static final String TB_SERVICIO_PREFIJO = "S";
	public static final String TB_SERVICIO_CAMPO_NID_SERVICIO = "NID_SERVICIO";

	public static final String TB_CENTRO_ATENCION = "CENTRO_ATENCION";
	public static final String TB_CENTRO_ATENCION_PREFIJO = "CA";
	public static final String TB_CENTRO_ATENCION_CAMPO_NID_CENTRO_ATEN = "NID_CENTRO_ATEN";

	public static final String TB_USUARIO = "USUARIO";
	public static final String TB_USUARIO_PREFIJO = "U";
	public static final String TB_USUARIO_CAMPO_NID_USUARIO = "NID_USUARIO";

	public static final String TB_USUARIO_DETALLE = "USUARIO_DETALLE";
	public static final String TB_USUARIO_DETALLE_PREFIJO = "UD";
	public static final String TB_USUARIO_DETALLE_CAMPO_NID_USUARIO_DETALLE = "NID_USUARIO_DETALLE";
	public static final String TB_USUARIO_DETALLE_CAMPO_NID_USUARIO = "NID_USUARIO";
	public static final String TB_USUARIO_DETALLE_CAMPO_NID_EDNE = "NID_EDNE";
	public static final String TB_USUARIO_DETALLE_CAMPO_NID_CENTRO_ATEN = "NID_CENTRO_ATEN";

	public static final String TB_USUARIO_INGRESO = "USUARIO_INGRESO";
	public static final String TB_USUARIO_INGRESO_PREFIJO = "UI";
	public static final String TB_USUARIO_INGRESO_CAMPO_NID_USUARIO_INGRESO = "NID_USUARIO_INGRESO";
	public static final String TB_USUARIO_INGRESO_CAMPO_NID_USUARIO_DETALLE = "NID_USUARIO_DETALLE";

	public static final String TB_AGENTE_EXTERNO = "AGENTE_EXTERNO";
	public static final String TB_AGENTE_EXTERNO_PREFIJO = "AE";
	public static final String TB_AGENTE_EXTERNO_CAMPO_NID_AGENTE_EXTERNO = "NID_AGENTE_EXTERNO";
	public static final String TB_AGENTE_EXTERNO_CAMPO_NID_USUARIO_INGRESO = "NID_USUARIO_INGRESO";

	public static final String TB_USUARIO_SITUACION = "USUARIO_SITUACION";
	public static final String TB_USUARIO_SITUACION_PREFIJO = "US";
	public static final String TB_USUARIO_SITUACION_CAMPO_NID_USUARIO_SITUACION = "NID_USUARIO_SITUACION";
	public static final String TB_USUARIO_SITUACION_CAMPO_NID_USUARIO_DETALLE = "NID_USUARIO_DETALLE";

	public static final String TB_USUARIO_ACTIVIDAD = "USUARIO_ACTIVIDAD";
	public static final String TB_USUARIO_ACTIVIDAD_PREFIJO = "UA";
	public static final String TB_USUARIO_ACTIVIDAD_CAMPO_NID_USUARIO_ACTIVIDAD = "NID_USUARIO_ACTIVIDAD";
	public static final String TB_USUARIO_ACTIVIDAD_CAMPO_NID_USUARIO_DETALLE = "NID_USUARIO_DETALLE";

	// CAMPOS AUDITORIA
	public static final String SQL_AUDITORIA_QUERY = ",FLG_ACTIVO,NID_USUARIO_CREACION,FEC_CREACION,TXT_PC_CREACION,TXT_IP_CREACION) ";
	public static final String SQL_AUDITORIA_DATA = ",{FLG_ACTIVO},{NID_USUARIO_CREACION},{FEC_CREACION},{TXT_PC_CREACION},{TXT_IP_CREACION})";

	// TIPOS DATOS
	public static final String TIPO_VARCHAR2 = "VARCHAR2";
	public static final String TIPO_NUMBER = "NUMBER";
	public static final String TIPO_DATE = "DATE";
}

package pe.gob.mimp.reni.util;

import java.net.InetAddress;
import java.net.UnknownHostException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AdressUtil {

	private static final Logger log = LoggerFactory.getLogger(AdressUtil.class);

	public static String getIP(HttpServletRequest request) {
		String ipAddress = request.getHeader(ConstanteUtil.X_FORWARDED_FOR) != null
				? request.getHeader(ConstanteUtil.X_FORWARDED_FOR)
				: request.getRemoteAddr();
		return ipAddress;
	}

	public static String getHostname(HttpServletRequest request) {
		InetAddress addr;
		String ipAddress = request.getHeader(ConstanteUtil.X_FORWARDED_FOR) != null
				? request.getHeader(ConstanteUtil.X_FORWARDED_FOR)
				: request.getRemoteAddr();
		try {
			addr = InetAddress.getByName(ipAddress);
			return addr.getHostName();
		} catch (UnknownHostException e) {
			log.info(ExceptionUtils.getStackTrace(e));
			return null;
		}
	}
}

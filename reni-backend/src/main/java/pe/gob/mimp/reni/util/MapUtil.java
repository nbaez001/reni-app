package pe.gob.mimp.reni.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MapUtil {

	public static Integer getInt(Object o) {
		if (o != null) {
			return Integer.parseInt(o.toString());
		} else {
			return null;
		}
	}

	public static Long getLong(Object o) {
		if (o != null) {
			return Long.parseLong(o.toString());
		} else {
			return null;
		}
	}

	public static Double getDouble(Object o) {
		if (o != null) {
			return Double.parseDouble(o.toString());
		} else {
			return null;
		}
	}

	public static String getString(Object o) {
		if (o != null) {
			return o.toString();
		} else {
			return "";
		}
	}

	public static Date getDate(Object o, String patter) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(patter);
			if (o != null) {
				return sdf.parse(o.toString());
			} else {
				return null;
			}
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
	}

	public static String getStringDate(Object o, String inputPatter, String outputPatter) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(inputPatter);
			SimpleDateFormat sdf2 = new SimpleDateFormat(outputPatter);
			if (o != null) {
				Date fecha = sdf.parse(o.toString());
				return sdf2.format(fecha);
			} else {
				return "";
			}
		} catch (ParseException e) {
			e.printStackTrace();
			return "";
		}
	}

	public static String getStringTime(Object o, String inputPatter, String outputPatter) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(inputPatter);
			SimpleDateFormat sdf2 = new SimpleDateFormat(outputPatter);
			if (o != null) {
				Date fecha = sdf.parse(o.toString());
				return sdf2.format(fecha);
			} else {
				return "";
			}
		} catch (ParseException e) {
			e.printStackTrace();
			return "";
		}
	}

	@SuppressWarnings({"unchecked"})
    public static <T> T getType(Object obj) {
        return (T) obj;
    }

}

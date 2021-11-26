package pe.gob.mimp.reni.service;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import pe.gob.mimp.reni.dao.UsuarioOauth2Dao;
import pe.gob.mimp.reni.dto.CustomUser;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UsuarioResponse;

@Service
public class UsuarioOauth2Service implements UserDetailsService {

	Logger log = LoggerFactory.getLogger(UsuarioOauth2Service.class);

	@Autowired
	UsuarioOauth2Dao usuarioDao;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		log.info("[BUSCAR USUARIO][SERVICE][INICIO]");
		try {
			OutResponse<UsuarioResponse> out = usuarioDao.buscarUsuario(username);
			if (out.getRCodigo().equals(0)) {
				CustomUser customUser = new CustomUser(out.getObjeto());
				log.info("[BUSCAR USUARIO][SERVICE][FIN]");
				return customUser;
			} else {
				log.info("[BUSCAR USUARIO][SERVICE][ERROR]");
				throw new UsernameNotFoundException("Usuario " + username + " no fue encontrado en la Base de Datos");
			}
		} catch (Exception e) {
			log.info("[BUSCAR USUARIO][SERVICE][EXCEPTION][" + ExceptionUtils.getStackTrace(e) + "]");
			throw new UsernameNotFoundException("Error al autenticar " + username);
		}
	}

}

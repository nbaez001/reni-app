package pe.gob.mimp.reni.config;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

import pe.gob.mimp.reni.dto.CustomUser;

public class CustomTokenEnhancer extends JwtAccessTokenConverter {

	@Override
	public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
		CustomUser user = (CustomUser) authentication.getPrincipal();
		Map<String, Object> info = new LinkedHashMap<>(accessToken.getAdditionalInformation());
		info.put("idUsuario", user.getIdUsuario() != null ? user.getIdUsuario() : 0);
		info.put("idModulo", user.getIdModulo() != null ? user.getIdModulo() : 0);
		info.put("idPersona", user.getIdPersona() != null ? user.getIdPersona() : 0);
		info.put("idTipDocumento", user.getIdTipDocumento() != null ? user.getIdTipDocumento() : 0);
		info.put("nomTipDocumento", user.getNomTipDocumento() != null ? user.getNomTipDocumento() : "");
		info.put("nroDocumento", user.getNroDocumento() != null ? user.getNroDocumento() : "");
		info.put("apePaterno", user.getApePaterno() != null ? user.getApePaterno() : "");
		info.put("apeMaterno", user.getApeMaterno() != null ? user.getApeMaterno() : "");
		info.put("nombres", user.getNombres() != null ? user.getNombres() : "");
		info.put("idCargo", user.getIdCargo() != null ? user.getIdCargo() : 0);
		info.put("nomCargo", user.getNomCargo() != null ? user.getNomCargo() : "");
		info.put("idArea", user.getIdArea() != null ? user.getIdArea() : 0);
		info.put("nomArea", user.getNomArea() != null ? user.getNomArea() : "");
		info.put("idPerfil", user.getIdPerfil() != null ? user.getIdPerfil() : 0);
		info.put("nomPerfil", user.getNomPerfil() != null ? user.getNomPerfil() : "");

		DefaultOAuth2AccessToken customAccessToken = new DefaultOAuth2AccessToken(accessToken);
		customAccessToken.setAdditionalInformation(info);
		return super.enhance(customAccessToken, authentication);
	}
}

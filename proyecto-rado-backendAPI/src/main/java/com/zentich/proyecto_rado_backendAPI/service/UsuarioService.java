package com.zentich.proyecto_rado_backendAPI.service;

import com.zentich.proyecto_rado_backendAPI.dto.LoginDTO;
import com.zentich.proyecto_rado_backendAPI.model.Usuario;
import com.zentich.proyecto_rado_backendAPI.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario autenticarUsuario(LoginDTO loginDto) {
        // 1. Buscamos el usuario en la BD por nombreUsuario
        Optional<Usuario> usuarioOpt = usuarioRepository.findByNombreUsuario(loginDto.getUsuario());
        
        // 2. Si existe, validamos la contraseña
        if (usuarioOpt.isPresent()) {
            Usuario usuarioFisico = usuarioOpt.get();
            if (usuarioFisico.getContrasenaUsuario().equals(loginDto.getPassword())) {
                return usuarioFisico; // Devolvemos el usuario completo
            }
        }
        return null; // Devuelve nulo si la clave es mala o no existe
    }
}
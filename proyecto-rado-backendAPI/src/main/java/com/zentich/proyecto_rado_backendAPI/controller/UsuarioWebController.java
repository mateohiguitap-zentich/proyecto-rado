package com.zentich.proyecto_rado_backendAPI.controller;

import com.zentich.proyecto_rado_backendAPI.model.Usuario;
import com.zentich.proyecto_rado_backendAPI.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class UsuarioWebController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/registro-web")
    public String mostrarFormulario() {
        return "usuario-form";
    }

    @PostMapping("/procesar-registro")
    public String procesarRegistro(
            @RequestParam("nombreUsuario") String nombreUsuario, 
            @RequestParam("contrasenaUsuario") String contrasenaUsuario,
            @RequestParam("rolUsuario") String rolUsuario) { 
        
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombreUsuario(nombreUsuario);
        nuevoUsuario.setContrasenaUsuario(contrasenaUsuario);
        nuevoUsuario.setRolUsuario(rolUsuario);
        
        usuarioRepository.save(nuevoUsuario);
        
        return "redirect:/registro-web"; 
    }
}
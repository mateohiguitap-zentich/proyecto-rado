package com.zentich.proyecto_rado_backendAPI.controller;

// Importaciones necesarias para que Java reconozca las clases
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

    // 1. MÉTODO GET: Muestra el formulario en el navegador
    @GetMapping("/registro-web")
    public String mostrarFormulario() {
        return "usuario-form"; // Apuntará al archivo HTML/JSP llamado "usuario-form"
    }

    // 2. MÉTODO POST: Recibe los datos del formulario y los guarda
    @PostMapping("/procesar-registro")
    public String procesarRegistro(
            @RequestParam("nombreUsuario") String nombreUsuario, 
            @RequestParam("contrasenaUsuario") String contrasenaUsuario,
            @RequestParam("rolUsuario") String rolUsuario) { 
        
        // Creamos el objeto y usamos TUS métodos Setters
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombreUsuario(nombreUsuario);
        nuevoUsuario.setContrasenaUsuario(contrasenaUsuario);
        nuevoUsuario.setRolUsuario(rolUsuario);
        
        // Guardamos en la base de datos
        usuarioRepository.save(nuevoUsuario);
        
        // Recargamos la página del formulario al terminar
        return "redirect:/registro-web"; 
    }
}

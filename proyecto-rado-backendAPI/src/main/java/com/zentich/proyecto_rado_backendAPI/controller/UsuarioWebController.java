package com.zentich.proyecto_rado_backendAPI.controller;

import com.zentich.proyecto_rado_backendAPI.model.Usuario;
import com.zentich.proyecto_rado_backendAPI.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Controlador de presentación encargado de gestionar las peticiones web
 * para el módulo de administración de usuarios en el sistema RADO.
 * Se encarga de mapear las solicitudes del navegador hacia las vistas de Thymeleaf.
 *
 * @author Mateo Higuita Patiño
 * @version 1.0
 */
@Controller
public class UsuarioWebController {

    /**
     * Inyección de dependencia del repositorio para realizar operaciones CRUD 
     * sobre la entidad Usuario y persistir la información en la base de datos MySQL.
     */
    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Atiende las solicitudes HTTP GET para mostrar la interfaz visual de registro.
     * Retorna la plantilla HTML encargada de capturar los datos del usuario.
     *
     * @return String Nombre de la plantilla HTML (usuario-form) a renderizar por Thymeleaf.
     */
    @GetMapping("/registro-web")
    public String mostrarFormulario() {
        return "usuario-form";
    }

    /**
     * Atiende las solicitudes HTTP POST enviadas desde el formulario web.
     * Captura los parámetros de la interfaz, instancia un nuevo objeto de tipo Usuario
     * y realiza su almacenamiento persistente a través del repositorio.
     *
     * @param nombreUsuario Nombre de inicio de sesión o identificación del usuario.
     * @param contrasenaUsuario Clave de acceso secreta suministrada en el formulario.
     * @param rolUsuario Perfil o nivel de privilegios asignado en el sistema (ej: ADMINISTRADOR).
     * @return String Redirección hacia la ruta del formulario para recargar la vista limpiamente.
     */
    @PostMapping("/procesar-registro")
    public String procesarRegistro(
            @RequestParam("nombreUsuario") String nombreUsuario, 
            @RequestParam("contrasenaUsuario") String contrasenaUsuario,
            @RequestParam("rolUsuario") String rolUsuario) { 
        
        // Instanciación del modelo de datos de la entidad
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombreUsuario(nombreUsuario);
        nuevoUsuario.setContrasenaUsuario(contrasenaUsuario);
        nuevoUsuario.setRolUsuario(rolUsuario);
        
        // Persistencia del objeto en la base de datos relacional
        usuarioRepository.save(nuevoUsuario);
        
        // Redirección para aplicar el patrón Post-Redirect-Get y evitar reenvíos duplicados
        return "redirect:/registro-web"; 
    }
}
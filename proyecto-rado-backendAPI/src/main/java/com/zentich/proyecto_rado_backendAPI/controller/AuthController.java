package com.zentich.proyecto_rado_backendAPI.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador REST (Servicio Web) encargado de gestionar la autenticación
 * de los usuarios en el sistema RADO.
 * Este servicio cumple con el diseño de API para el inicio de sesión.
 *
 * @author Mateo Higuita Patiño
 * @version 1.0
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite que tu Frontend (React/HTML) se conecte sin bloqueos de seguridad CORS
public class AuthController {

    /**
     * Servicio web para el inicio de sesión.
     * Recibe las credenciales en formato JSON, las valida y retorna un mensaje
     * de éxito o error según el caso.
     *
     * @param credenciales Mapa que contiene las llaves 'usuario' y 'contrasena'.
     * @return ResponseEntity con un mapa JSON que incluye el mensaje resultante y el código HTTP.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> iniciarSesion(@RequestBody Map<String, String> credenciales) {
        
        // 1. Capturamos los datos enviados desde el Frontend
        String usuario = credenciales.get("usuario");
        String contrasena = credenciales.get("contrasena");
        
        // Objeto para estructurar la respuesta en formato JSON
        Map<String, String> respuesta = new HashMap<>();

        // 2. Lógica de validación de autenticación
        // (En un entorno de producción, aquí se consulta el UsuarioRepository)
        if ("admin".equals(usuario) && "admin123".equals(contrasena)) {
            
            // Autenticación correcta: Retorna mensaje de éxito y código HTTP 200 (OK)
            respuesta.put("mensaje", "Autenticación satisfactoria");
            return ResponseEntity.ok(respuesta);
            
        } else {
            
            // Autenticación incorrecta: Retorna mensaje de error y código HTTP 401 (No Autorizado)
            respuesta.put("error", "Error en la autenticación. Verifique sus credenciales.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);
            
        }
    }
}
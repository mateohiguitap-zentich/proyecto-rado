package com.zentich.proyecto_rado_backendAPI.controller;

import com.zentich.proyecto_rado_backendAPI.dto.LoginDTO;
import com.zentich.proyecto_rado_backendAPI.model.Usuario;
import com.zentich.proyecto_rado_backendAPI.repository.UsuarioRepository;
import com.zentich.proyecto_rado_backendAPI.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST encargado de gestionar las peticiones HTTP para el módulo de usuarios.
 * Expone los servicios de la API para la gestión de accesos dentro del sistema RADO.
 * Implementa las políticas de CORS para permitir la integración con interfaces externas.
 *
 * @author Mateo Higuita Patiño
 * @version 1.0
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*") 
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    // ==========================================
    // NUEVO ENDPOINT: INICIO DE SESIÓN
    // ==========================================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDto) {
        boolean esValido = usuarioService.autenticarUsuario(loginDto);
        
        if (esValido) {
            return new ResponseEntity<>("Autenticación exitosa", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Credenciales incorrectas", HttpStatus.UNAUTHORIZED);
        }
    }

    // ==========================================
    // ENDPOINTS EXISTENTES (CRUD)
    // ==========================================
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    public Usuario guardarUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @PutMapping("/{id}")
    public Usuario actualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioDetalles) {
        usuarioDetalles.setIdUsuario(id);
        return usuarioRepository.save(usuarioDetalles);
    }

    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Integer id) {
        usuarioRepository.deleteById(id);
    }
}
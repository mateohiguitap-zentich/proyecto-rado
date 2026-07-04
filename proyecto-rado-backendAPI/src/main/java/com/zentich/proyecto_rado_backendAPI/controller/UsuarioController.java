package com.zentich.proyecto_rado_backendAPI.controller;

import com.zentich.proyecto_rado_backendAPI.model.Usuario;
import com.zentich.proyecto_rado_backendAPI.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    /**
     * Inyección de dependencia del repositorio para realizar operaciones CRUD 
     * directamente sobre la tabla de usuarios en la base de datos.
     */
    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Endpoint para consultar y obtener la lista completa de usuarios registrados.
     * Atiende las peticiones HTTP GET.
     *
     * @return List<Usuario> Una colección con todos los usuarios almacenados.
     */
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    /**
     * Endpoint para registrar de forma persistente un nuevo usuario en el sistema.
     * Atiende las peticiones HTTP POST y deserializa el JSON entrante.
     *
     * @param usuario Objeto de tipo Usuario mapeado desde el cuerpo de la petición (@RequestBody).
     * @return Usuario El objeto persistido, devolviendo el ID autogenerado por la base de datos.
     */
    @PostMapping
    public Usuario guardarUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
}
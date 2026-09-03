package com.zentich.proyecto_rado_backendAPI.repository;

import com.zentich.proyecto_rado_backendAPI.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Interfaz de acceso a datos (DAO) para la entidad Usuario.
 * Extiende de JpaRepository para heredar los métodos estándar de persistencia (CRUD) 
 * e interactuar con la base de datos MySQL de forma automática mediante Spring Data JPA.
 *
 * @author Mateo Higuita Patiño
 * @version 1.0
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByNombreUsuario(String nombreUsuario);
}
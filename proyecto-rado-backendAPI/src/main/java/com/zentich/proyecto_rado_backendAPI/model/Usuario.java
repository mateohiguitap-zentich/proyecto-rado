package com.zentich.proyecto_rado_backendAPI.model;

import jakarta.persistence.*;

/**
 * Entidad que representa a un usuario dentro del sistema RADO.
 * Se encarga de mapear los datos de credenciales y roles con la tabla "USUARIO" 
 * en la base de datos MySQL mediante JPA (Java Persistence API).
 *
 * @author Mateo Higuita Patiño
 * @version 1.0
 */
@Entity
@Table(name = "USUARIO")
public class Usuario {

    /**
     * Identificador único autoincremental del usuario en la base de datos.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    /**
     * Nombre de inicio de sesión o número de documento del usuario.
     */
    @Column(name = "nombre_usuario")
    private String nombreUsuario;

    /**
     * Contraseña o clave de acceso del usuario al sistema.
     */
    @Column(name = "contrasena_usuario")
    private String contrasenaUsuario;

    /**
     * Rol o perfil asignado para la restricción de accesos (ej: ADMINISTRADOR).
     */
    @Column(name = "rol_usuario")
    private String rolUsuario;

    /**
     * Constructor vacío requerido por JPA e Hibernate para la correcta 
     * instanciación y manejo de la entidad.
     */
    public Usuario() {
    }

    /**
     * Obtiene el identificador del usuario.
     *
     * @return Integer con el ID autogenerado.
     */
    public Integer getIdUsuario() {
        return idUsuario;
    }

    /**
     * Establece el identificador del usuario.
     *
     * @param idUsuario El ID a asignar al usuario.
     */
    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    /**
     * Obtiene el nombre o documento de inicio de sesión del usuario.
     *
     * @return String con el nombre de usuario.
     */
    public String getNombreUsuario() {
        return nombreUsuario;
    }

    /**
     * Establece el nombre de inicio de sesión del usuario.
     *
     * @param nombreUsuario El nombre o documento a registrar.
     */
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    /**
     * Obtiene la contraseña de acceso del usuario.
     *
     * @return String con la clave del usuario.
     */
    public String getContrasenaUsuario() {
        return contrasenaUsuario;
    }

    /**
     * Establece la contraseña de acceso del usuario.
     *
     * @param contrasenaUsuario La clave a guardar.
     */
    public void setContrasenaUsuario(String contrasenaUsuario) {
        this.contrasenaUsuario = contrasenaUsuario;
    }

    /**
     * Obtiene el rol o nivel de acceso del usuario en el sistema.
     *
     * @return String con el rol asignado.
     */
    public String getRolUsuario() {
        return rolUsuario;
    }

    /**
     * Establece el rol o perfil del usuario.
     *
     * @param rolUsuario El rol a asignar (ej. ADMINISTRADOR).
     */
    public void setRolUsuario(String rolUsuario) {
        this.rolUsuario = rolUsuario;
    }
}
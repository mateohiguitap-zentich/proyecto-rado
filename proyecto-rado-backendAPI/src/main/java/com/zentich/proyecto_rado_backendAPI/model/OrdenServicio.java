package com.zentich.proyecto_rado_backendAPI.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "ORDEN_SERVICIO")
public class OrdenServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Integer idOrden;

    @Column(name = "fecha_orden")
    private Date fechaOrden;

    @Column(name = "estado")
    private Integer estado; // 1: Activa, 0: Inactiva/Facturada

    @Column(name = "id_paciente")
    private Integer idPaciente;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "id_sede")
    private Integer idSede;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "odontologo_remitente", length = 150)
    private String odontologoRemitente;

    @PrePersist
    protected void onCreate() {
        this.fechaOrden = new Date();
        this.estado = 1; // Por defecto entra activa
    }

    // Genera aquí los Getters y Setters para todas las variables
    public Integer getIdOrden() { return idOrden; }
    public void setIdOrden(Integer idOrden) { this.idOrden = idOrden; }
    public Date getFechaOrden() { return fechaOrden; }
    public void setFechaOrden(Date fechaOrden) { this.fechaOrden = fechaOrden; }
    public Integer getEstado() { return estado; }
    public void setEstado(Integer estado) { this.estado = estado; }
    public Integer getIdPaciente() { return idPaciente; }
    public void setIdPaciente(Integer idPaciente) { this.idPaciente = idPaciente; }
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    public Integer getIdSede() { return idSede; }
    public void setIdSede(Integer idSede) { this.idSede = idSede; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getOdontologoRemitente() { return odontologoRemitente; }
    public void setOdontologoRemitente(String odontologoRemitente) { this.odontologoRemitente = odontologoRemitente; }
}
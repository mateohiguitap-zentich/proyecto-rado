package com.zentich.proyecto_rado_backendAPI.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "CONTACTO_DE_EMERGENCIA")
public class ContactoEmergencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contacto_emergencia")
    private Integer idContactoEmergencia;

    @Column(name = "nombre_contacto_emergencia", length = 100)
    private String nombreContactoEmergencia;

    @Column(name = "telefono_contacto_emergencia", length = 15)
    private String telefonoContactoEmergencia;

    @Column(name = "parentesco_contacto_emergencia", length = 50)
    private String parentescoContactoEmergencia;

    @ManyToOne
    @JoinColumn(name = "id_paciente")
    @JsonBackReference
    private Paciente paciente;

    // --- GETTERS Y SETTERS ---

    public Integer getIdContactoEmergencia() {
        return idContactoEmergencia;
    }

    public void setIdContactoEmergencia(Integer idContactoEmergencia) {
        this.idContactoEmergencia = idContactoEmergencia;
    }

    public String getNombreContactoEmergencia() {
        return nombreContactoEmergencia;
    }

    public void setNombreContactoEmergencia(String nombreContactoEmergencia) {
        this.nombreContactoEmergencia = nombreContactoEmergencia;
    }

    public String getTelefonoContactoEmergencia() {
        return telefonoContactoEmergencia;
    }

    public void setTelefonoContactoEmergencia(String telefonoContactoEmergencia) {
        this.telefonoContactoEmergencia = telefonoContactoEmergencia;
    }

    public String getParentescoContactoEmergencia() {
        return parentescoContactoEmergencia;
    }

    public void setParentescoContactoEmergencia(String parentescoContactoEmergencia) {
        this.parentescoContactoEmergencia = parentescoContactoEmergencia;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
}
package com.zentich.proyecto_rado_backendAPI.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "estudio")
public class Estudio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estudio")
    private Integer idEstudio;

    @Column(name = "nombre", length = 100)
    private String nombre;

    @Column(name = "precio")
    private BigDecimal precio;

    // --- GETTERS Y SETTERS ---
    public Integer getIdEstudio() { return idEstudio; }
    public void setIdEstudio(Integer idEstudio) { this.idEstudio = idEstudio; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
}
package com.zentich.proyecto_rado_backendAPI.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_orden")
public class DetalleOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle") // Agrega esta columna en tu MySQL para facilitar el backend
    private Integer idDetalle;

    @Column(name = "id_orden")
    private Integer idOrden;

    @Column(name = "id_estudio")
    private Integer idEstudio;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "subtotal")
    private BigDecimal subtotal;
    
    @Column(name = "observacion", length = 255) // Para el número de diente, etc.
    private String observacion;

    // --- GETTERS Y SETTERS ---
    public Integer getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Integer idDetalle) { this.idDetalle = idDetalle; }

    public Integer getIdOrden() { return idOrden; }
    public void setIdOrden(Integer idOrden) { this.idOrden = idOrden; }

    public Integer getIdEstudio() { return idEstudio; }
    public void setIdEstudio(Integer idEstudio) { this.idEstudio = idEstudio; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
}
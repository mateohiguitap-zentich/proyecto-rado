package com.zentich.proyecto_rado_backendAPI.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "factura")
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_factura")
    private Integer idFactura;

    @Column(name = "fecha_factura")
    private Timestamp fechaFactura;

    @Column(name = "total_factura")
    private BigDecimal totalFactura;

    @Column(name = "id_orden")
    private Integer idOrden;

    // --- GETTERS Y SETTERS ---
    public Integer getIdFactura() { return idFactura; }
    public void setIdFactura(Integer idFactura) { this.idFactura = idFactura; }

    public Timestamp getFechaFactura() { return fechaFactura; }
    public void setFechaFactura(Timestamp fechaFactura) { this.fechaFactura = fechaFactura; }

    public BigDecimal getTotalFactura() { return totalFactura; }
    public void setTotalFactura(BigDecimal totalFactura) { this.totalFactura = totalFactura; }

    public Integer getIdOrden() { return idOrden; }
    public void setIdOrden(Integer idOrden) { this.idOrden = idOrden; }
}

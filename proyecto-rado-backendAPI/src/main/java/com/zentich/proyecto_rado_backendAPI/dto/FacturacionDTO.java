package com.zentich.proyecto_rado_backendAPI.dto;

import java.math.BigDecimal;
import java.util.List;

public class FacturacionDTO {
    
    private Integer idOrden;
    private BigDecimal totalFactura;
    private List<DetalleDTO> detalles;

    public Integer getIdOrden() { return idOrden; }
    public void setIdOrden(Integer idOrden) { this.idOrden = idOrden; }

    public BigDecimal getTotalFactura() { return totalFactura; }
    public void setTotalFactura(BigDecimal totalFactura) { this.totalFactura = totalFactura; }

    public List<DetalleDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleDTO> detalles) { this.detalles = detalles; }

    // Clase interna para atrapar la lista de estudios
    public static class DetalleDTO {
        private Integer idEstudio;
        private Integer cantidad;
        private BigDecimal subtotal;
        private String observacion;

        public Integer getIdEstudio() { return idEstudio; }
        public void setIdEstudio(Integer idEstudio) { this.idEstudio = idEstudio; }

        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

        public String getObservacion() { return observacion; }
        public void setObservacion(String observacion) { this.observacion = observacion; }
    }
}

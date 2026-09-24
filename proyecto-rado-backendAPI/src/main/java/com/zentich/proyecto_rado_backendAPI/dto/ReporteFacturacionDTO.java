package com.zentich.proyecto_rado_backendAPI.dto;

public interface ReporteFacturacionDTO {
    String getFecha();
    String getIdPaciente();
    String getNombre();
    String getConvenio();
    String getReferido();
    String getFactura();
    String getDescripcion();
    String getMetodoPago();
    String getSede();
    Double getValor();
}
package com.zentich.proyecto_rado_backendAPI.controller;

import com.zentich.proyecto_rado_backendAPI.dto.FacturacionDTO;
import com.zentich.proyecto_rado_backendAPI.model.DetalleOrden;
import com.zentich.proyecto_rado_backendAPI.model.Factura;
import com.zentich.proyecto_rado_backendAPI.repository.DetalleOrdenRepository;
import com.zentich.proyecto_rado_backendAPI.repository.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;

@RestController
@RequestMapping("/api/facturacion")
@CrossOrigin(origins = "*")
public class FacturacionController {

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private DetalleOrdenRepository detalleOrdenRepository;

    @PostMapping("/cobrar")
    @Transactional // Esto asegura que si falla el detalle, no se guarde la factura a medias (Rollback)
    public ResponseEntity<?> generarFactura(@RequestBody FacturacionDTO payload) {
        try {
            // 1. Guardar la Factura Principal
            Factura nuevaFactura = new Factura();
            nuevaFactura.setIdOrden(payload.getIdOrden());
            nuevaFactura.setTotalFactura(payload.getTotalFactura());
            nuevaFactura.setFechaFactura(new Timestamp(System.currentTimeMillis())); // Fecha y hora actual
            nuevaFactura.setMetodoPago(payload.getMetodoPago());
            facturaRepository.save(nuevaFactura);
            
            facturaRepository.save(nuevaFactura);

            // 2. Guardar cada estudio en el Detalle de la Orden
            if (payload.getDetalles() != null && !payload.getDetalles().isEmpty()) {
                for (FacturacionDTO.DetalleDTO item : payload.getDetalles()) {
                    DetalleOrden detalle = new DetalleOrden();
                    detalle.setIdOrden(payload.getIdOrden());
                    detalle.setIdEstudio(item.getIdEstudio());
                    detalle.setCantidad(item.getCantidad() != null ? item.getCantidad() : 1);
                    detalle.setSubtotal(item.getSubtotal());
                    detalle.setObservacion(item.getObservacion());
                    
                    detalleOrdenRepository.save(detalle);
                }
            }

            return new ResponseEntity<>("Factura generada y cobrada con éxito", HttpStatus.CREATED);
            
        } catch (Exception e) {
            return new ResponseEntity<>("Error al generar la factura: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

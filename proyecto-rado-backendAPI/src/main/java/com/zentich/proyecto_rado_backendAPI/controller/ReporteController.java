package com.zentich.proyecto_rado_backendAPI.controller;

import com.zentich.proyecto_rado_backendAPI.dto.ConsolidadoDTO;
import com.zentich.proyecto_rado_backendAPI.dto.ReporteFacturacionDTO;
import com.zentich.proyecto_rado_backendAPI.repository.ReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*") 
public class ReporteController {

    @Autowired
    private ReporteRepository reporteRepository;

    @GetMapping("/consolidado")
    public ResponseEntity<List<ConsolidadoDTO>> getConsolidado(
            @RequestParam String inicio, 
            @RequestParam String fin) {
        
        String fechaInicio = inicio + " 00:00:00";
        String fechaFin = fin + " 23:59:59";
        
        List<ConsolidadoDTO> resultado = reporteRepository.obtenerConsolidado(fechaInicio, fechaFin);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/facturacion")
    public ResponseEntity<List<ReporteFacturacionDTO>> getFacturacion(
            @RequestParam String inicio, 
            @RequestParam String fin) {
        
        String fechaInicio = inicio + " 00:00:00";
        String fechaFin = fin + " 23:59:59";
        
        List<ReporteFacturacionDTO> resultado = reporteRepository.obtenerFacturacion(fechaInicio, fechaFin);
        return ResponseEntity.ok(resultado);
    }
}

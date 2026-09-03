package com.zentich.proyecto_rado_backendAPI.controller;

import com.zentich.proyecto_rado_backendAPI.model.OrdenServicio;
import com.zentich.proyecto_rado_backendAPI.repository.OrdenServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "*")
public class OrdenServicioController {

    @Autowired
    private OrdenServicioRepository ordenRepository;

    @PostMapping("/guardar")
    public ResponseEntity<?> guardarOrden(@RequestBody OrdenServicio orden) {
        try {
            OrdenServicio nuevaOrden = ordenRepository.save(orden);
            return new ResponseEntity<>(nuevaOrden, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar la orden: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
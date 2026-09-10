package com.zentich.proyecto_rado_backendAPI.controller;

import com.zentich.proyecto_rado_backendAPI.model.Sede;
import com.zentich.proyecto_rado_backendAPI.repository.SedeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sedes")
@CrossOrigin(origins = "*")
public class SedeController {

    @Autowired
    private SedeRepository sedeRepository;

    @GetMapping("/listar")
    public ResponseEntity<List<Sede>> listarSedes() {
        List<Sede> sedes = sedeRepository.findAll();
        return new ResponseEntity<>(sedes, HttpStatus.OK);
    }
}

package com.zentich.proyecto_rado_backendAPI.controller;

import com.zentich.proyecto_rado_backendAPI.model.Estudio;
import com.zentich.proyecto_rado_backendAPI.repository.EstudioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudios")
@CrossOrigin(origins = "*")
public class EstudioController {

    @Autowired
    private EstudioRepository estudioRepository;

    @GetMapping("/listar")
    public List<Estudio> listarEstudios() {
        return estudioRepository.findAll();
    }
}

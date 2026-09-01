package com.zentich.proyecto_rado_backendAPI.controller;

import com.zentich.proyecto_rado_backendAPI.dto.RegistroPacienteDTO;
import com.zentich.proyecto_rado_backendAPI.model.Paciente;
import com.zentich.proyecto_rado_backendAPI.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*") 
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarPaciente(@RequestBody RegistroPacienteDTO dto) {
        try {
            Paciente nuevoPaciente = pacienteService.registrarPacienteConContacto(dto);
            return new ResponseEntity<>(nuevoPaciente, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/buscar/{documento}")
    public ResponseEntity<?> buscarPaciente(@PathVariable String documento) {
        Paciente paciente = pacienteService.buscarPorDocumento(documento);
        if (paciente != null) {
            return new ResponseEntity<>(paciente, HttpStatus.OK); // 200 OK
        }
        return new ResponseEntity<>("Paciente no encontrado", HttpStatus.NOT_FOUND); // 404
    }

    // Endpoint para EDITAR (PUT)
    @PutMapping("/editar/{id}")
    public ResponseEntity<?> editarPaciente(@PathVariable Integer id, @RequestBody RegistroPacienteDTO dto) {
        try {
            Paciente pacienteActualizado = pacienteService.actualizarPaciente(id, dto);
            return new ResponseEntity<>(pacienteActualizado, HttpStatus.OK); // 200 OK
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND); // 404
        }
    }

    // Endpoint para ELIMINAR (DELETE)
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarPaciente(@PathVariable Integer id) {
        try {
            pacienteService.eliminarPaciente(id);
            return new ResponseEntity<>("Paciente eliminado correctamente", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para LISTAR TODOS (GET)
    @GetMapping("/listar")
    public ResponseEntity<java.util.List<Paciente>> listarPacientes() {
        java.util.List<Paciente> pacientes = pacienteService.listarTodos();
        return new ResponseEntity<>(pacientes, HttpStatus.OK);
    }
}

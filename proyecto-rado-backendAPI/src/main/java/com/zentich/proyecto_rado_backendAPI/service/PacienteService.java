package com.zentich.proyecto_rado_backendAPI.service;

import com.zentich.proyecto_rado_backendAPI.dto.RegistroPacienteDTO;
import com.zentich.proyecto_rado_backendAPI.model.ContactoEmergencia;
import com.zentich.proyecto_rado_backendAPI.model.Paciente;
import com.zentich.proyecto_rado_backendAPI.repository.ContactoEmergenciaRepository;
import com.zentich.proyecto_rado_backendAPI.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ContactoEmergenciaRepository contactoRepository;

    @Transactional
    public Paciente registrarPacienteConContacto(RegistroPacienteDTO dto) {
        
        if (pacienteRepository.existsByDocumentoPaciente(dto.getDocumentoPaciente())) {
            throw new RuntimeException("El paciente con documento " + dto.getDocumentoPaciente() + " ya existe.");
        }

        Paciente paciente = new Paciente();
        paciente.setNombrePaciente(dto.getNombrePaciente());
        paciente.setDocumentoPaciente(dto.getDocumentoPaciente());
        paciente.setFechaNacimientoPaciente(dto.getFechaNacimientoPaciente());
        paciente.setDireccionPaciente(dto.getDireccionPaciente());
        paciente.setTelefonoPaciente(dto.getTelefonoPaciente());
        paciente.setEmailPaciente(dto.getEmailPaciente());
        paciente.setSexo(dto.getSexo());
        
        Paciente pacienteGuardado = pacienteRepository.save(paciente);

        ContactoEmergencia contacto = new ContactoEmergencia();
        contacto.setNombreContactoEmergencia(dto.getNombreContacto());
        contacto.setTelefonoContactoEmergencia(dto.getTelefonoContacto());
        contacto.setParentescoContactoEmergencia(dto.getParentescoContacto());
        contacto.setPaciente(pacienteGuardado);

        contactoRepository.save(contacto);

        return pacienteGuardado;
    }

    public Paciente buscarPorDocumento(String documento) {
        return pacienteRepository.findByDocumentoPaciente(documento).orElse(null);
    }

    // ==========================================
    // NUEVAS FUNCIONES: EDITAR Y ELIMINAR
    // ==========================================

    // 1. Método para actualizar/editar
    public Paciente actualizarPaciente(Integer id, RegistroPacienteDTO dto) {
        // Buscamos si el paciente realmente existe
        Paciente pacienteExistente = pacienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        // Actualizamos los datos personales
        pacienteExistente.setNombrePaciente(dto.getNombrePaciente());
        pacienteExistente.setDocumentoPaciente(dto.getDocumentoPaciente());
        pacienteExistente.setTipoDocumento(dto.getTipoDocumento());
        pacienteExistente.setFechaNacimientoPaciente(dto.getFechaNacimientoPaciente());
        pacienteExistente.setDireccionPaciente(dto.getDireccionPaciente());
        pacienteExistente.setTelefonoPaciente(dto.getTelefonoPaciente());
        pacienteExistente.setEmailPaciente(dto.getEmailPaciente());
        pacienteExistente.setSexo(dto.getSexo());

        // Actualizamos el contacto de emergencia si existe en el JSON
        if (pacienteExistente.getContactos() != null && !pacienteExistente.getContactos().isEmpty()) {
            ContactoEmergencia contacto = pacienteExistente.getContactos().get(0);
            contacto.setNombreContactoEmergencia(dto.getNombreContacto());
            contacto.setTelefonoContactoEmergencia(dto.getTelefonoContacto());
            contacto.setParentescoContactoEmergencia(dto.getParentescoContacto());
        }

        // Guardamos los cambios en la base de datos
        return pacienteRepository.save(pacienteExistente);
    }

    // 2. Método para eliminar
    public void eliminarPaciente(Integer id) {
        if (!pacienteRepository.existsById(id)) {
            throw new RuntimeException("El paciente no existe");
        }
        pacienteRepository.deleteById(id);
    }

    // Método para listar todos los pacientes
    public java.util.List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }
}
package com.zentich.proyecto_rado_backendAPI.repository;

import com.zentich.proyecto_rado_backendAPI.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    boolean existsByDocumentoPaciente(String documentoPaciente);
    java.util.Optional<Paciente> findByDocumentoPaciente(String documentoPaciente);
}
package com.zentich.proyecto_rado_backendAPI.repository;

import com.zentich.proyecto_rado_backendAPI.model.ContactoEmergencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactoEmergenciaRepository extends JpaRepository<ContactoEmergencia, Integer> {
}
package com.zentich.proyecto_rado_backendAPI.repository;

import com.zentich.proyecto_rado_backendAPI.model.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SedeRepository extends JpaRepository<Sede, Integer> {
}

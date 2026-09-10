package com.zentich.proyecto_rado_backendAPI.repository;

import com.zentich.proyecto_rado_backendAPI.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Integer> {
}
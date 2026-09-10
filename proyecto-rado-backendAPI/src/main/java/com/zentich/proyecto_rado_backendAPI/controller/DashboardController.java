package com.zentich.proyecto_rado_backendAPI.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/metricas/{idSede}")
    public Map<String, Object> obtenerMetricas(@PathVariable Integer idSede) {
        Map<String, Object> metricas = new HashMap<>();

        // 1. Total Pacientes (Histórico de la sede)
        String sqlTotal = "SELECT COUNT(DISTINCT id_paciente) FROM orden_servicio WHERE id_sede = ?";
        Integer totalPacientes = jdbcTemplate.queryForObject(sqlTotal, Integer.class, idSede);

        // 2. Pacientes Atendidos Hoy (En esa sede)
        String sqlHoy = "SELECT COUNT(DISTINCT id_paciente) FROM orden_servicio WHERE id_sede = ? AND DATE(fecha_orden) = CURDATE()";
        Integer pacientesHoy = jdbcTemplate.queryForObject(sqlHoy, Integer.class, idSede);

        // 3. Facturación del Día (Sumar facturas de hoy de esa sede)
        String sqlFacturacion = "SELECT SUM(f.total_factura) FROM factura f JOIN orden_servicio o ON f.id_orden = o.id_orden WHERE o.id_sede = ? AND DATE(f.fecha_factura) = CURDATE()";
        Double facturacionHoy = jdbcTemplate.queryForObject(sqlFacturacion, Double.class, idSede);

        // 4. Actividad Reciente (Últimas 3 facturas con nombre de paciente y estudio)
        String sqlActividad = "SELECT p.nombre_paciente, o.descripcion, f.total_factura FROM factura f JOIN orden_servicio o ON f.id_orden = o.id_orden JOIN paciente p ON o.id_paciente = p.id_paciente WHERE o.id_sede = ? ORDER BY f.fecha_factura DESC LIMIT 3";
        List<Map<String, Object>> actividad = jdbcTemplate.queryForList(sqlActividad, idSede);

        // Empaquetar y enviar al Frontend
        metricas.put("totalPacientes", totalPacientes != null ? totalPacientes : 0);
        metricas.put("pacientesHoy", pacientesHoy != null ? pacientesHoy : 0);
        metricas.put("facturacionHoy", facturacionHoy != null ? facturacionHoy : 0.0);
        metricas.put("actividadReciente", actividad);

        return metricas;
    }
}
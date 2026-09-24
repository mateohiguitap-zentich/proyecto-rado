package com.zentich.proyecto_rado_backendAPI.repository;

import com.zentich.proyecto_rado_backendAPI.dto.ConsolidadoDTO;
import com.zentich.proyecto_rado_backendAPI.dto.ReporteFacturacionDTO;
import com.zentich.proyecto_rado_backendAPI.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Factura, Integer> {

    // 1. REPORTE: CONSOLIDADO POR SEDE
    @Query(value = "SELECT s.nombre_sede AS sede, f.metodo_pago AS metodoPago, SUM(f.total_factura) AS total " +
                   "FROM factura f " +
                   "JOIN orden_servicio o ON f.id_orden = o.id_orden " +
                   "JOIN sede s ON o.id_sede = s.id_sede " +
                   "WHERE f.fecha_factura >= :inicio AND f.fecha_factura <= :fin " +
                   "GROUP BY s.nombre_sede, f.metodo_pago", nativeQuery = true)
    List<ConsolidadoDTO> obtenerConsolidado(@Param("inicio") String inicio, @Param("fin") String fin);

    // 2. REPORTE: FACTURACIÓN DETALLADA (Con prefijos dinámicos por sede)
    @Query(value = "SELECT " +
                   "DATE_FORMAT(f.fecha_factura, '%d/%m/%Y') AS fecha, " +
                   "p.documento_paciente AS idPaciente, " +
                   "p.nombre_paciente AS nombre, " +
                   "COALESCE(p.aseguradora, 'PARTICULAR') AS convenio, " +
                   "o.odontologo_remitente AS referido, " +
                   // --- INICIO DE LA MAGIA DEL PREFIJO ---
                   "CONCAT(CASE " +
                   "    WHEN s.nombre_sede LIKE '%Bello%' THEN 'FERB' " +
                   "    WHEN s.nombre_sede LIKE '%Centro%' THEN 'FERC' " +
                   "    WHEN s.nombre_sede LIKE '%Obelisco%' THEN 'FERO' " +
                   "    ELSE 'FER' " +
                   "END, f.id_factura) AS factura, " +
                   // --- FIN DE LA MAGIA ---
                   "o.descripcion AS descripcion, " +
                   "f.metodo_pago AS metodoPago, " +
                   "s.nombre_sede AS sede, " +
                   "f.total_factura AS valor " +
                   "FROM factura f " +
                   "JOIN orden_servicio o ON f.id_orden = o.id_orden " +
                   "JOIN paciente p ON o.id_paciente = p.id_paciente " +
                   "JOIN sede s ON o.id_sede = s.id_sede " +
                   "WHERE f.fecha_factura >= :inicio AND f.fecha_factura <= :fin " +
                   "ORDER BY f.fecha_factura DESC", nativeQuery = true)
    List<ReporteFacturacionDTO> obtenerFacturacion(@Param("inicio") String inicio, @Param("fin") String fin);
}
// =====================================================================
// CALCULAR EDAD SEGÚN LA FECHA DE NACIMIENTO
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const fechaInput = document.getElementById('fechaNacimiento');
    if (fechaInput) {
        fechaInput.addEventListener('change', function() {
            const fechaNac = new Date(this.value);
            const hoy = new Date();
            if (isNaN(fechaNac.getTime())) return;
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) { edad--; }
            document.getElementById('displayEdad').value = edad + (edad === 1 ? " año" : " años");
        });
    }
});

// =====================================================================
// BOTÓN AGREGAR ESTUDIO EN LA SECCIÓN ORDEN VIRTUAL
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const inputEstudio = document.getElementById('inputEstudio');
    const btnAgregar = document.getElementById('btnAgregarEstudio');
    const contenedor = document.getElementById('contenedorEstudios');
    const placeholder = document.getElementById('textoPlaceholder');

    if (btnAgregar && inputEstudio && contenedor) {
        function agregarEstudio() {
            const nombreEstudio = inputEstudio.value.trim(); 
            if (nombreEstudio === "") return;
            if (placeholder) placeholder.style.display = 'none';

            const badge = document.createElement('div');
            badge.className = 'badge bg-white text-dark border p-2 shadow-sm d-inline-flex align-items-center';
            badge.innerHTML = `
                ${nombreEstudio} 
                <i class="bi bi-x-circle-fill text-danger ms-2" style="cursor: pointer; font-size: 1.1rem;" title="Eliminar estudio"></i>
            `;

            const btnEliminar = badge.querySelector('i');
            btnEliminar.addEventListener('click', function() {
                badge.remove(); 
                if (contenedor.querySelectorAll('.badge').length === 0) {
                    if (placeholder) placeholder.style.display = 'block';
                }
            });

            contenedor.appendChild(badge);
            inputEstudio.value = '';
            inputEstudio.focus();
        }

        btnAgregar.addEventListener('click', agregarEstudio);

        inputEstudio.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                agregarEstudio();
            }
        });
    }
});

// =====================================================================
// CONEXIÓN BACKEND: GUARDAR PACIENTE NUEVO Y REDIRIGIR
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const btnFinalizar = document.getElementById('btnFinalizarRegistro');
    
    if(btnFinalizar) {
        btnFinalizar.addEventListener('click', async function(e) {
            e.preventDefault(); 

            // Si el paciente ya existe, nos saltamos el guardado y vamos directo a la orden
            if (this.dataset.existe === "true") {
                window.location.href = "orden_virtual.html";
                return;
            }

            const pacienteDTO = {
                tipoDocumento: document.getElementById('tipoDoc').value, // <-- NUEVA LÍNEA AQUÍ
                nombrePaciente: document.getElementById('nomPaciente').value,
                documentoPaciente: document.getElementById('docPaciente').value,
                fechaNacimientoPaciente: document.getElementById('fechaNacimiento').value,
                direccionPaciente: document.getElementById('dirPaciente').value,
                telefonoPaciente: document.getElementById('telPaciente').value,
                emailPaciente: document.getElementById('emailPaciente').value,
                nombreContacto: document.getElementById('nomContacto').value,
                telefonoContacto: document.getElementById('telContacto').value,
                parentescoContacto: document.getElementById('parentescoContacto').value
            };

            if(!pacienteDTO.nombrePaciente || !pacienteDTO.documentoPaciente) {
                alert("Por favor, ingrese al menos el nombre y el documento del paciente.");
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/pacientes/registrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pacienteDTO)
                });

                if (response.status === 201) {
                    const data = await response.json();
                    alert("¡Éxito! Paciente " + data.nombrePaciente + " registrado en el Sistema RADO.");
                    window.location.href = "orden_virtual.html";
                } else {
                    const errorMessage = await response.text();
                    alert("Error del servidor: " + errorMessage);
                }
            } catch (error) {
                console.error("Fallo de conexión:", error);
                alert("Error crítico: No se pudo conectar con el servidor backend. Verifica que Spring Boot esté encendido.");
            }
        });
    }
});

// =====================================================================
// AUTOCOMPLETAR DATOS SI EL PACIENTE YA EXISTE
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const docInput = document.getElementById('docPaciente');
    
    if(docInput) {
        docInput.addEventListener('blur', async function() {
            const documento = this.value.trim();

            if (document.getElementById('idPacienteOculto').value !== "") {
                return; 
            }
            
            if(documento.length > 0) {
                try {
                    const response = await fetch('http://localhost:8080/api/pacientes/buscar/' + documento);
                    
                    if(response.status === 200) {
                        const paciente = await response.json();
                        
                        console.log("DATOS REALES DEL SERVIDOR:", paciente);

                        // Mostrar barra y guardar ID
                        document.getElementById('idPacienteOculto').value = paciente.idPaciente;
                        document.getElementById('barraAccionesPaciente').classList.remove('d-none');
                        
                        // Llenar casillas
                        if(paciente.tipoDocumento) {
                            document.getElementById('tipoDoc').value = paciente.tipoDocumento; // <-- NUEVA LÍNEA AQUÍ
                        }
                        document.getElementById('nomPaciente').value = paciente.nombrePaciente;
                        document.getElementById('fechaNacimiento').value = paciente.fechaNacimientoPaciente;
                        document.getElementById('dirPaciente').value = paciente.direccionPaciente;
                        document.getElementById('telPaciente').value = paciente.telefonoPaciente;
                        document.getElementById('emailPaciente').value = paciente.emailPaciente;
                        
                        if(paciente.contactos && paciente.contactos.length > 0) {
                            document.getElementById('nomContacto').value = paciente.contactos[0].nombreContactoEmergencia;
                            document.getElementById('telContacto').value = paciente.contactos[0].telefonoContactoEmergencia;
                            document.getElementById('parentescoContacto').value = paciente.contactos[0].parentescoContactoEmergencia;
                        }

                        const btn = document.getElementById('btnFinalizarRegistro');
                        btn.innerHTML = '<i class="bi bi-arrow-right-circle-fill me-2"></i> CONTINUAR A ORDEN VIRTUAL';
                        btn.dataset.existe = "true"; 
                        
                        const eventoFecha = new Event('change');
                        document.getElementById('fechaNacimiento').dispatchEvent(eventoFecha);
                    } else {
                        // Ocultar barra 
                        document.getElementById('idPacienteOculto').value = "";
                        document.getElementById('barraAccionesPaciente').classList.add('d-none');

                        const btn = document.getElementById('btnFinalizarRegistro');
                        btn.innerHTML = '<i class="bi bi-file-earmark-plus-fill me-2"></i> FINALIZAR REGISTRO Y GENERAR ORDEN VIRTUAL';
                        btn.dataset.existe = "false";
                    }
                } catch (error) {
                    console.error("Error buscando paciente:", error);
                }
            }
        });
    }
}); 

// =====================================================================
// FUNCIONES DE ACTUALIZAR Y ELIMINAR (BARRA SUPERIOR)
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const btnActualizar = document.getElementById('btnActualizarArriba');
    const btnEliminar = document.getElementById('btnEliminarArriba');

    if (btnActualizar && btnEliminar) {
        
        // --- FUNCIÓN ACTUALIZAR (PUT) ---
        btnActualizar.addEventListener('click', async function() {
            const idPaciente = document.getElementById('idPacienteOculto').value;
            
            const pacienteDTO = {
                tipoDocumento: document.getElementById('tipoDoc').value, // <-- NUEVA LÍNEA AQUÍ
                nombrePaciente: document.getElementById('nomPaciente').value,
                documentoPaciente: document.getElementById('docPaciente').value,
                fechaNacimientoPaciente: document.getElementById('fechaNacimiento').value,
                direccionPaciente: document.getElementById('dirPaciente').value,
                telefonoPaciente: document.getElementById('telPaciente').value,
                emailPaciente: document.getElementById('emailPaciente').value,
                nombreContacto: document.getElementById('nomContacto').value,
                telefonoContacto: document.getElementById('telContacto').value,
                parentescoContacto: document.getElementById('parentescoContacto').value
            };

            try {
                const response = await fetch('http://localhost:8080/api/pacientes/editar/' + idPaciente, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pacienteDTO)
                });

                if (response.status === 200) {
                    alert("¡Datos del paciente actualizados correctamente!");
                    window.location.reload(); 
                } else {
                    alert("Error al actualizar los datos.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });

        // --- FUNCIÓN ELIMINAR (DELETE) ---
        btnEliminar.addEventListener('click', async function() {
            const idPaciente = document.getElementById('idPacienteOculto').value;
            const nombre = document.getElementById('nomPaciente').value;

            const seguro = confirm(`⚠️ ADVERTENCIA: ¿Está seguro que desea eliminar todo el historial de ${nombre}?\n\nEsta acción borrará al paciente y sus contactos de emergencia.`);
            
            if (seguro) {
                try {
                    const response = await fetch('http://localhost:8080/api/pacientes/eliminar/' + idPaciente, {
                        method: 'DELETE'
                    });

                    if (response.status === 200) {
                        alert("Registro eliminado definitivamente.");
                        window.location.reload(); 
                    } else {
                        alert("No se pudo eliminar el registro. Puede que tenga órdenes activas.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        });
    }
});
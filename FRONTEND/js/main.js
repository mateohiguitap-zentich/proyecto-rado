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

            if (this.dataset.existe === "true") {
                guardarDatosMemoria(); 
                window.location.href = "orden_virtual.html";
                return;
            }

            const pacienteDTO = {
                tipoDocumento: document.getElementById('tipoDoc').value,
                nombrePaciente: document.getElementById('nomPaciente').value,
                documentoPaciente: document.getElementById('docPaciente').value,
                fechaNacimientoPaciente: document.getElementById('fechaNacimiento').value,
                direccionPaciente: document.getElementById('dirPaciente').value,
                telefonoPaciente: document.getElementById('telPaciente').value,
                emailPaciente: document.getElementById('emailPaciente').value,
                sexo: document.getElementById('generoPaciente').value,
                // <--- NUEVOS CAMPOS AQUÍ --->
                estadoCivil: document.getElementById('estadoCivil') ? document.getElementById('estadoCivil').value : "",
                aseguradora: document.getElementById('aseguradora') ? document.getElementById('aseguradora').value : "",
                tipoVinculacion: document.getElementById('tipoVinculacion') ? document.getElementById('tipoVinculacion').value : "",
                // <-------------------------->
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
                    
                    guardarDatosMemoria(); 
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

                        document.getElementById('idPacienteOculto').value = paciente.idPaciente;
                        document.getElementById('barraAccionesPaciente').classList.remove('d-none');
                        
                        if(paciente.tipoDocumento) {
                            document.getElementById('tipoDoc').value = paciente.tipoDocumento; 
                        }
                        document.getElementById('nomPaciente').value = paciente.nombrePaciente;
                        document.getElementById('fechaNacimiento').value = paciente.fechaNacimientoPaciente;
                        document.getElementById('dirPaciente').value = paciente.direccionPaciente;
                        document.getElementById('telPaciente').value = paciente.telefonoPaciente;
                        document.getElementById('emailPaciente').value = paciente.emailPaciente;
                        
                        if(paciente.sexo) {
                            const selectGenero = document.getElementById('generoPaciente');
                            if(selectGenero) selectGenero.value = paciente.sexo;
                        }

                        // <--- NUEVOS CAMPOS AQUÍ --->
                        if(paciente.estadoCivil && document.getElementById('estadoCivil')) {
                            document.getElementById('estadoCivil').value = paciente.estadoCivil;
                        }
                        if(paciente.aseguradora && document.getElementById('aseguradora')) {
                            document.getElementById('aseguradora').value = paciente.aseguradora;
                        }
                        if(paciente.tipoVinculacion && document.getElementById('tipoVinculacion')) {
                            document.getElementById('tipoVinculacion').value = paciente.tipoVinculacion;
                        }
                        // <-------------------------->
                        
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
        
        btnActualizar.addEventListener('click', async function() {
            const idPaciente = document.getElementById('idPacienteOculto').value;
            
            const pacienteDTO = {
                tipoDocumento: document.getElementById('tipoDoc').value, 
                nombrePaciente: document.getElementById('nomPaciente').value,
                documentoPaciente: document.getElementById('docPaciente').value,
                fechaNacimientoPaciente: document.getElementById('fechaNacimiento').value,
                direccionPaciente: document.getElementById('dirPaciente').value,
                telefonoPaciente: document.getElementById('telPaciente').value,
                emailPaciente: document.getElementById('emailPaciente').value,
                sexo: document.getElementById('generoPaciente').value,
                // <--- NUEVOS CAMPOS AQUÍ --->
                estadoCivil: document.getElementById('estadoCivil') ? document.getElementById('estadoCivil').value : "",
                aseguradora: document.getElementById('aseguradora') ? document.getElementById('aseguradora').value : "",
                tipoVinculacion: document.getElementById('tipoVinculacion') ? document.getElementById('tipoVinculacion').value : "",
                // <-------------------------->
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

// =====================================================================
// FUNCIÓN AUXILIAR: GUARDAR DATOS EN MEMORIA LOCAL
// =====================================================================
function guardarDatosMemoria() {
    const idOculto = document.getElementById('idPacienteOculto');
    if (idOculto && idOculto.value !== "") {
        localStorage.setItem('rado_idPaciente', idOculto.value);
    }
    
    localStorage.setItem('rado_nombre', document.getElementById('nomPaciente').value);
    localStorage.setItem('rado_documento', document.getElementById('docPaciente').value);
    localStorage.setItem('rado_fechaNac', document.getElementById('fechaNacimiento').value);
    
    const genero = document.getElementById('generoPaciente');
    if(genero) localStorage.setItem('rado_sexo', genero.value);

    // <--- NUEVOS CAMPOS AQUÍ (Opcional pero recomendado) --->
    const estCivil = document.getElementById('estadoCivil');
    if(estCivil) localStorage.setItem('rado_estadoCivil', estCivil.value);
    
    const aseguradora = document.getElementById('aseguradora');
    if(aseguradora) localStorage.setItem('rado_aseguradora', aseguradora.value);
    
    const vinculacion = document.getElementById('tipoVinculacion');
    if(vinculacion) localStorage.setItem('rado_tipoVinculacion', vinculacion.value);
    // <------------------------------------------------------->
}

// =====================================================================
// CARGAR DATOS AUTOMÁTICAMENTE EN ORDEN VIRTUAL
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const docOrdenInput = document.getElementById('docOrden'); 
    
    if (docOrdenInput) {
        const nombre = localStorage.getItem('rado_nombre');
        const doc = localStorage.getItem('rado_documento');
        const fecha = localStorage.getItem('rado_fechaNac');
        const sexo = localStorage.getItem('rado_sexo');

        if (nombre) document.getElementById('nombreOrden').value = nombre;
        if (doc) docOrdenInput.value = doc;
        
        if (sexo) {
            const sexoSelect = document.getElementById('sexoOrden');
            if(sexoSelect) sexoSelect.value = sexo;
        }
        
        if (fecha) {
            const fechaInput = document.getElementById('fechaNacOrden');
            if(fechaInput) fechaInput.value = fecha;
            
            const fechaNac = new Date(fecha);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) { edad--; }
            
            const edadInput = document.getElementById('edadOrden');
            if(edadInput) edadInput.value = edad;
        }
    }
});

// =====================================================================
// GUARDAR ORDEN E IMPRIMIR / GUARDAR COMO PDF (NATIVO)
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const formOrden = document.querySelector('form'); 
    const btnGuardarOrden = document.querySelector('button[type="submit"].btn-primary'); 

    if (formOrden && btnGuardarOrden && window.location.pathname.includes('orden_virtual')) {
        
        formOrden.addEventListener('submit', async function(e) {
            e.preventDefault();

            const badges = document.querySelectorAll('#contenedorEstudios .badge');
            let listaEstudios = [];
            badges.forEach(b => {
                const textoEstudio = b.childNodes[0].nodeValue.trim();
                listaEstudios.push(textoEstudio);
            });

            if (listaEstudios.length === 0) {
                alert("Debe agregar al menos un estudio a la orden.");
                return;
            }

            const odontologo = document.getElementById('odontologoOrden').value.trim() || "N/A";
            const correo = document.getElementById('correoOdontologoOrden').value.trim() || "N/A";
            const formatoEntrega = document.querySelector('.form-select').value || "No especificado";

            const descripcionFinal = `Estudios: ${listaEstudios.join(", ")} | Odontólogo: ${odontologo} | Correo: ${correo} | Formato: ${formatoEntrega}`;

            const ordenDTO = {
                idPaciente: localStorage.getItem('rado_idPaciente') || 0,
                idUsuario: 1, 
                idSede: 1,
                descripcion: descripcionFinal
            };

            try {
                const response = await fetch('http://localhost:8080/api/ordenes/guardar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ordenDTO)
                });

                if (response.status === 201) {
                    alert("¡Orden guardada en la base de datos con éxito! Se abrirá la ventana de impresión.");
                    
                    localStorage.setItem('rado_estudios_orden', listaEstudios.join(", "));

                    const sidebar = document.querySelector('.sidebar');
                    const headerActions = document.querySelector('.header-actions');
                    const footerButtons = document.querySelector('.d-flex.justify-content-end.mt-4');
                    const iconos = document.querySelectorAll('#contenedorEstudios i');

                    if(sidebar) sidebar.style.display = 'none';
                    if(headerActions) headerActions.style.display = 'none';
                    if(footerButtons) footerButtons.style.display = 'none';
                    iconos.forEach(el => el.style.display = 'none');

                    window.print();

                    window.onafterprint = function() {
                        if(sidebar) sidebar.style.display = '';
                        if(headerActions) headerActions.style.display = '';
                        if(footerButtons) headerActions.style.display = '';
                        iconos.forEach(el => el.style.display = '');

                        window.location.href = "facturacion_electronica.html";
                    };

                } else {
                    const errorMsg = await response.text();
                    alert("Error al guardar la orden: " + errorMsg);
                }
            } catch (error) {
                console.error("Error crítico:", error);
                alert("Error de conexión con el servidor backend.");
            }
        });
    }
});
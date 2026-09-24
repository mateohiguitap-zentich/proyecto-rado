// =====================================================================
// GUARDIÁN DE SESIÓN Y DATOS DEL USUARIO ACTIVO
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const rutaActual = window.location.pathname.toLowerCase();
    // Evitamos que el guardián actúe si estamos en la página de Login
    const esPaginaLogin = rutaActual.includes('index.html') || rutaActual.endsWith('/');

    const nombreUsuarioActivo = localStorage.getItem('rado_usuario_nombre');
    
    // Si no hay usuario en memoria y NO estamos en el login, lo expulsamos
    if (!nombreUsuarioActivo && !esPaginaLogin) {
        alert("Sesión no válida. Por favor inicie sesión.");
        window.location.href = "index.html";
        return;
    }

    // Mostrar el nombre del usuario en la parte superior (si existe el contenedor en el HTML)
    const displayElement = document.getElementById('displayNombreUsuario');
    if (displayElement && nombreUsuarioActivo) {
        displayElement.textContent = nombreUsuarioActivo;
    }
});

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
// CARGAR CATÁLOGO DE ESTUDIOS Y LÓGICA DE AGREGAR EN ORDEN VIRTUAL
// =====================================================================
document.addEventListener("DOMContentLoaded", async function() {
    const selectEstudio = document.getElementById('selectEstudio');
    const inputObservacion = document.getElementById('inputObservacion');
    const btnAgregar = document.getElementById('btnAgregarEstudio');
    const contenedor = document.getElementById('contenedorEstudios');
    const placeholder = document.getElementById('textoPlaceholder');

    // 1. Cargar la lista de estudios desde MySQL al abrir la página
    if (selectEstudio) {
        try {
            const response = await fetch('http://localhost:8080/api/estudios/listar');
            if (response.ok) {
                const estudios = await response.json();
                selectEstudio.innerHTML = '<option value="" selected disabled>Seleccione un estudio...</option>';
                
                estudios.forEach(est => {
                    selectEstudio.innerHTML += `<option value="${est.idEstudio}" data-nombre="${est.nombre}">${est.nombre}</option>`;
                });
            }
        } catch (error) {
            console.error("Error al cargar el catálogo de estudios:", error);
            selectEstudio.innerHTML = '<option value="" selected disabled>Error cargando estudios</option>';
        }
    }

    // 2. Lógica para agregar el estudio a la lista (Badges)
    if (btnAgregar && selectEstudio && contenedor) {
        function agregarEstudio() {
            const idEstudio = selectEstudio.value;
            if (!idEstudio) {
                alert("Por favor, seleccione un estudio de la lista.");
                return;
            }

            const opcionSeleccionada = selectEstudio.options[selectEstudio.selectedIndex];
            const nombreEstudio = opcionSeleccionada.dataset.nombre;
            const observacion = inputObservacion.value.trim(); 
            
            if (placeholder) placeholder.style.display = 'none';

            // Armar el texto visual
            let textoVisual = nombreEstudio;
            if(observacion !== "") textoVisual += ` <small class="text-muted fst-italic">(${observacion})</small>`;

            const badge = document.createElement('div');
            badge.className = 'badge bg-white text-dark border p-2 shadow-sm d-inline-flex align-items-center mb-2 me-2';
            
            // Guardar los datos reales en el HTML de forma oculta para leerlos al guardar
            badge.dataset.id = idEstudio;
            badge.dataset.nombre = nombreEstudio;
            badge.dataset.observacion = observacion;

            badge.innerHTML = `
                ${textoVisual} 
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
            
            // Limpiar campos después de agregar
            selectEstudio.value = '';
            inputObservacion.value = '';
        }

        btnAgregar.addEventListener('click', agregarEstudio);

        if(inputObservacion) {
            inputObservacion.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault(); 
                    agregarEstudio();
                }
            });
        }
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
                estadoCivil: document.getElementById('estadoCivil') ? document.getElementById('estadoCivil').value : "",
                aseguradora: document.getElementById('aseguradora') ? document.getElementById('aseguradora').value : "",
                tipoVinculacion: document.getElementById('tipoVinculacion') ? document.getElementById('tipoVinculacion').value : "",
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
                    localStorage.setItem('rado_idPaciente', data.idPaciente);

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
                        
                        document.getElementById('idPacienteOculto').value = paciente.idPaciente;
                        document.getElementById('barraAccionesPaciente').classList.remove('d-none');
                        
                        if(paciente.tipoDocumento) {
                            document.getElementById('tipoDoc').value = paciente.tipoDocumento; 
                        }
                        document.getElementById('nomPaciente').value = paciente.nombrePaciente;
                        document.getElementById('fechaNacimiento').value = paciente.fechaNacimientoPaciente;
                        document.getElementById('dirPaciente').value = paciente.direccionPaciente || '';
                        document.getElementById('telPaciente').value = paciente.telefonoPaciente || '';
                        document.getElementById('emailPaciente').value = paciente.emailPaciente || '';
                        
                        if(paciente.sexo) {
                            const selectGenero = document.getElementById('generoPaciente');
                            if(selectGenero) selectGenero.value = paciente.sexo;
                        }

                        if(paciente.estadoCivil && document.getElementById('estadoCivil')) {
                            document.getElementById('estadoCivil').value = paciente.estadoCivil;
                        }
                        if(paciente.aseguradora && document.getElementById('aseguradora')) {
                            document.getElementById('aseguradora').value = paciente.aseguradora;
                        }
                        if(paciente.tipoVinculacion && document.getElementById('tipoVinculacion')) {
                            document.getElementById('tipoVinculacion').value = paciente.tipoVinculacion;
                        }
                        
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
                estadoCivil: document.getElementById('estadoCivil') ? document.getElementById('estadoCivil').value : "",
                aseguradora: document.getElementById('aseguradora') ? document.getElementById('aseguradora').value : "",
                tipoVinculacion: document.getElementById('tipoVinculacion') ? document.getElementById('tipoVinculacion').value : "",
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
                    const response = await fetch('http://localhost:8080/api/pacientes/eliminar/' + idPaciente, { method: 'DELETE' });
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
    
    // Guardar nombre, documento y fecha
    localStorage.setItem('rado_nombre', document.getElementById('nomPaciente').value);
    localStorage.setItem('rado_documento', document.getElementById('docPaciente').value);
    localStorage.setItem('rado_fechaNac', document.getElementById('fechaNacimiento').value);
    
    // --- NUEVAS LÍNEAS AGREGADAS PARA LA FACTURACIÓN ---
    const direccion = document.getElementById('dirPaciente');
    if(direccion) localStorage.setItem('rado_direccion', direccion.value || 'No registrada');

    const telefono = document.getElementById('telPaciente');
    if(telefono) localStorage.setItem('rado_telefono', telefono.value || 'No registrado');

    const correo = document.getElementById('emailPaciente');
    if(correo) localStorage.setItem('rado_correo', correo.value || 'No registrado');
    // ---------------------------------------------------

    const genero = document.getElementById('generoPaciente');
    if(genero) localStorage.setItem('rado_sexo', genero.value);

    const estCivil = document.getElementById('estadoCivil');
    if(estCivil) localStorage.setItem('rado_estadoCivil', estCivil.value);
    
    const aseguradora = document.getElementById('aseguradora');
    if(aseguradora) localStorage.setItem('rado_aseguradora', aseguradora.value);
    
    const vinculacion = document.getElementById('tipoVinculacion');
    if(vinculacion) localStorage.setItem('rado_tipoVinculacion', vinculacion.value);
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
// GUARDAR ORDEN Y MOSTRAR VENTANA EMERGENTE PARA IMPRESIÓN (MVP)
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const formOrden = document.querySelector('form'); 
    const btnGuardarOrden = document.querySelector('button[type="submit"].btn-primary'); 

    if (formOrden && btnGuardarOrden && window.location.pathname.includes('orden_virtual')) {
        
        formOrden.addEventListener('submit', async function(e) {
            e.preventDefault();

            const badges = document.querySelectorAll('#contenedorEstudios .badge');
            let listaEstudiosEstructurada = [];
            let descripcionNombres = [];

            badges.forEach(b => {
                listaEstudiosEstructurada.push({
                    idEstudio: b.dataset.id,
                    nombre: b.dataset.nombre,
                    observacion: b.dataset.observacion
                });
                
                let textoDesc = b.dataset.nombre;
                if(b.dataset.observacion) textoDesc += ` (${b.dataset.observacion})`;
                descripcionNombres.push(textoDesc);
            });

            if (listaEstudiosEstructurada.length === 0) {
                alert("Debe agregar al menos un estudio a la orden.");
                return;
            }

            const odontologo = document.getElementById('odontologoOrden').value.trim() || "N/A";
            const correo = document.getElementById('correoOdontologoOrden').value.trim() || "N/A";
            const formatoEntrega = document.getElementById('formatoEntregaOrden') ? document.getElementById('formatoEntregaOrden').value : "No especificado";
            const descripcionFinal = descripcionNombres.join(", ");

            let idSedeActual = localStorage.getItem('rado_sede_id');
            if(!idSedeActual) {
                alert("Por favor seleccione una sede en el Dashboard antes de crear órdenes.");
                return;
            }

            const ordenDTO = {
                idPaciente: localStorage.getItem('rado_idPaciente') || 0,
                idUsuario: 1, 
                idSede: parseInt(idSedeActual),
                descripcion: descripcionFinal,
                odontologoRemitente: odontologo
            };

            try {
                const response = await fetch('http://localhost:8080/api/ordenes/guardar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ordenDTO)
                });

                if (response.status === 201) {
                    const ordenGuardada = await response.json();
                    
                    // Guardamos en memoria para la factura
                    localStorage.setItem('rado_estudios_orden_json', JSON.stringify(listaEstudiosEstructurada));
                    localStorage.setItem('rado_ultima_orden_id', ordenGuardada.idOrden);

                    // =========================================================
                    // NUEVA LÓGICA: LLENAR Y MOSTRAR LA VENTANA EMERGENTE
                    // =========================================================
                    
                    // 1. Llenar textos básicos
                    document.getElementById('modalOrdenId').textContent = "ORD-00" + ordenGuardada.idOrden;
                    document.getElementById('modalPacienteNombre').textContent = document.getElementById('nombreOrden').value || "No especificado";
                    document.getElementById('modalPacienteDoc').textContent = document.getElementById('docOrden').value || "No especificado";
                    
                    // Capturamos los nuevos datos
                    const inputFechaNac = document.getElementById('fechaNacOrden'); 
                    const inputEdad = document.getElementById('edadOrden'); 
                    
                    document.getElementById('modalPacienteFecNac').textContent = inputFechaNac && inputFechaNac.value ? inputFechaNac.value : "No especificada";
                    document.getElementById('modalPacienteEdad').textContent = inputEdad && inputEdad.value ? inputEdad.value : "Sin edad";
                    
                    document.getElementById('modalOdontologo').textContent = odontologo;
                    document.getElementById('modalCorreoOdonto').textContent = correo;
                    document.getElementById('modalFormato').textContent = formatoEntrega;
                    
                    // Fecha actual
                    const hoy = new Date();
                    document.getElementById('modalFecha').textContent = hoy.toLocaleDateString();

                    // 2. Llenar la lista de estudios dinámicamente
                    const listaHtml = document.getElementById('modalListaEstudios');
                    listaHtml.innerHTML = '';
                    listaEstudiosEstructurada.forEach(est => {
                        let obs = est.observacion ? ` <small class="text-muted fst-italic">(${est.observacion})</small>` : '';
                        listaHtml.innerHTML += `<li class="list-group-item py-1 small"><i class="bi bi-check2-square me-2 text-success"></i> ${est.nombre}${obs}</li>`;
                    });

                    // 3. Mostrar el Modal (Ventana Emergente) de Bootstrap
                    const modal = new bootstrap.Modal(document.getElementById('modalImpresionOrden'));
                    modal.show();

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

// =====================================================================
// CARGAR SEDES DINÁMICAMENTE EN EL DASHBOARD
// =====================================================================
document.addEventListener("DOMContentLoaded", async function() {
    const sedeActualSpan = document.getElementById('sedeActual');
    const dropdownMenu = document.querySelector('ul[aria-labelledby="dropdownSedes"]');

    if (sedeActualSpan && dropdownMenu) {
        try {
            const response = await fetch('http://localhost:8080/api/sedes/listar');
            if (response.ok) {
                const sedes = await response.json();
                dropdownMenu.innerHTML = '<li><h6 class="dropdown-header small text-muted">Seleccionar Sede</h6></li>';

                let sedeGuardadaId = localStorage.getItem('rado_sede_id');
                let sedeGuardadaNombre = localStorage.getItem('rado_sede_nombre');

                if ((!sedeGuardadaId || !sedeGuardadaNombre) && sedes.length > 0) {
                    sedeGuardadaId = sedes[0].idSede;
                    sedeGuardadaNombre = sedes[0].nombreSede;
                    localStorage.setItem('rado_sede_id', sedeGuardadaId);
                    localStorage.setItem('rado_sede_nombre', sedeGuardadaNombre);
                }

                if (sedeGuardadaNombre) {
                    sedeActualSpan.textContent = sedeGuardadaNombre;
                }

                if (sedeGuardadaId) {
                    cargarMetricasDashboard(sedeGuardadaId);
                }

                sedes.forEach(sede => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.className = 'dropdown-item small py-2';
                    a.href = '#';
                    a.innerHTML = `<i class="bi bi-geo-alt me-2"></i> ${sede.nombreSede}`;

                    a.addEventListener('click', function(e) {
                        e.preventDefault();
                        localStorage.setItem('rado_sede_id', sede.idSede);
                        localStorage.setItem('rado_sede_nombre', sede.nombreSede);
                        sedeActualSpan.textContent = sede.nombreSede;
                        cargarMetricasDashboard(sede.idSede);
                    });

                    li.appendChild(a);
                    dropdownMenu.appendChild(li);
                });
            }
        } catch (error) {
            console.error("Fallo de conexión al cargar sedes:", error);
        }
    }
});

// =====================================================================
// FUNCIÓN PARA CONSULTAR Y PINTAR MÉTRICAS DEL DASHBOARD
// =====================================================================
async function cargarMetricasDashboard(idSede) {
    try {
        const response = await fetch('http://localhost:8080/api/dashboard/metricas/' + idSede);
        if (response.ok) {
            const data = await response.json();
            const formater = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

            // 1. Cargar las tarjetas numéricas superiores
            document.getElementById('totalPacientesTxt').textContent = data.totalPacientes;
            document.getElementById('pacientesHoyTxt').textContent = data.pacientesHoy;
            document.getElementById('facturacionHoyTxt').textContent = formater.format(data.facturacionHoy);

            // 2. --- MAGIA DE LA GRÁFICA: ACTUALIZAR CHART.JS ---
            const chartExistente = Chart.getChart('graficoPacientes');
            if (chartExistente && data.pacientesPorDia) {
                // Inyectamos el arreglo que llegó de la base de datos MySQL
                chartExistente.data.datasets[0].data = data.pacientesPorDia;
                // Le ordenamos a la gráfica redibujarse con los nuevos picos
                chartExistente.update(); 
            }
            // ---------------------------------------------------

            // 3. Cargar la lista de actividad reciente (facturas)
            const contenedor = document.getElementById('contenedorActividad');
            contenedor.innerHTML = ''; 
            
            if(data.actividadReciente.length === 0) {
                 contenedor.innerHTML = '<p class="text-muted small">No hay facturación reciente en esta sede.</p>';
            } else {
                 data.actividadReciente.forEach(item => {
                     contenedor.innerHTML += `
                        <div class="activity-item d-flex align-items-center justify-content-between mb-4">
                            <div class="d-flex align-items-center">
                                <div class="rounded-circle me-3 bg-light text-primary d-flex align-items-center justify-content-center border" style="width: 40px; height: 40px; font-size: 1.2rem;">
                                    <i class="bi bi-person-check"></i>
                                </div>
                                <div>
                                    <p class="mb-0 fw-bold small text-dark">${item.nombre_paciente}</p>
                                    <p class="mb-0 text-muted smaller" style="font-size: 0.75rem;">${item.descripcion}</p>
                                </div>
                            </div>
                            <span class="text-success fw-bold small">${formater.format(item.total_factura)}</span>
                        </div>
                     `;
                 });
            }
        }
    } catch (error) {
        console.error("Error al cargar métricas:", error);
    }
}

// =====================================================================
// MÓDULO DE FACTURACIÓN ELECTRÓNICA
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const tablaEstudios = document.getElementById('tablaEstudiosCobrar');
    const totalInput = document.getElementById('totalAPagar');
    // Seleccionamos el botón de Guardar (el verde de la cabecera)
    const btnGuardarFactura = document.querySelector('header .btn-success'); 

    if (tablaEstudios && totalInput) {
        // 1. Extraer los datos guardados de la Orden Virtual reciente
        const nombre = localStorage.getItem('rado_nombre') || 'Paciente no seleccionado';
        const documento = localStorage.getItem('rado_documento') || 'N/A';
        const direccion = localStorage.getItem('rado_direccion') || '';
        const telefono = localStorage.getItem('rado_telefono') || '';
        const correo = localStorage.getItem('rado_correo') || '';
        
        const idOrden = localStorage.getItem('rado_ultima_orden_id');
        const estudiosJson = localStorage.getItem('rado_estudios_orden_json');
        const sedeNombre = localStorage.getItem('rado_sede_nombre') || 'Sede Principal';

        // 2. Llenar los datos visuales del paciente y la clínica
        const inputNumFactura = document.getElementById('numFactura');
        const inputNombre = document.getElementById('nombrePacienteFac');
        const inputDoc = document.getElementById('docPacienteFac');
        const spanSede = document.getElementById('infoSedeFactura');
        
        // Elementos de contacto
        const inputDireccion = document.getElementById('dirPacienteFac'); 
        const inputTelefono = document.getElementById('telPacienteFac');
        const inputCorreo = document.getElementById('emailPacienteFac');

        if (inputNombre) inputNombre.value = nombre;
        if (inputDoc) inputDoc.value = documento;
        if (inputDireccion) inputDireccion.value = direccion;
        if (inputTelefono) inputTelefono.value = telefono;
        if (inputCorreo) inputCorreo.value = correo;
        if (inputNumFactura && idOrden) inputNumFactura.value = "ORD-00" + idOrden;
        if (spanSede) spanSede.textContent = "Sede: " + sedeNombre;

        // 3. Llenar la tabla de estudios a cobrar
        if (estudiosJson) {
            const estudios = JSON.parse(estudiosJson);
            tablaEstudios.innerHTML = ''; // Limpiar el mensaje inicial

            estudios.forEach(est => {
                const observacionTexto = est.observacion ? est.observacion : 'N/A';
                tablaEstudios.innerHTML += `
                    <tr data-idestudio="${est.idEstudio}" data-observacion="${est.observacion}">
                        <td class="small fw-bold">${est.nombre}</td>
                        <td class="small text-muted">${observacionTexto}</td>
                        <td>
                            <input type="number" class="form-control form-control-sm text-end input-precio fw-bold text-primary" placeholder="Ej: 25000" min="0">
                        </td>
                    </tr>
                `;
            });
        }

        // 4. Lógica para calcular el total automático
        function calcularTotal() {
            let total = 0;
            const inputsPrecio = document.querySelectorAll('.input-precio');
            inputsPrecio.forEach(input => {
                const valor = parseFloat(input.value) || 0;
                total += valor;
            });
            
            // Formatear a pesos para la vista
            const formater = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 });
            totalInput.value = formater.format(total);
            
            // Guardar el número crudo en un atributo oculto para enviarlo al backend
            totalInput.dataset.valorReal = total; 
        }

        // Escuchar cuando el cajero digita un precio
        tablaEstudios.addEventListener('input', function(e) {
            if (e.target.classList.contains('input-precio')) {
                calcularTotal();
            }
        });

        // 5. Enviar la Factura al Backend al hacer clic en "Guardar"
        if (btnGuardarFactura) {
            btnGuardarFactura.addEventListener('click', async function() {
                if (!idOrden) {
                    alert("No hay ninguna orden activa. Vaya a 'Orden Virtual' y genere una primero.");
                    return;
                }

                const metodoPago = document.getElementById('metodoPago').value;
                if (!metodoPago) {
                    alert("Por favor seleccione un Método de Pago antes de guardar.");
                    return;
                }

                const totalFactura = parseFloat(totalInput.dataset.valorReal) || 0;
                if (totalFactura <= 0) {
                    alert("El Total a Pagar no puede ser cero. Asigne precios a los estudios.");
                    return;
                }

                // Empaquetar los estudios y sus precios
                const detallesDTO = [];
                const filas = tablaEstudios.querySelectorAll('tr');
                
                filas.forEach(fila => {
                    const idEst = fila.dataset.idestudio;
                    const obs = fila.dataset.observacion;
                    const precioInput = fila.querySelector('.input-precio').value;
                    const subtotal = parseFloat(precioInput) || 0;

                    // Solo guardamos los estudios con valor
                    if (subtotal > 0) {
                        detallesDTO.push({
                            idEstudio: parseInt(idEst),
                            cantidad: 1,
                            subtotal: subtotal,
                            observacion: obs === 'undefined' ? '' : obs
                        });
                    }
                });

                if (detallesDTO.length === 0) {
                    alert("Debe asignar precio válido a los estudios.");
                    return;
                }

                const facturacionDTO = {
                    idOrden: parseInt(idOrden),
                    totalFactura: totalFactura,
                    metodoPago: metodoPago,
                    detalles: detallesDTO
                };

                try {
                    const response = await fetch('http://localhost:8080/api/facturacion/cobrar', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(facturacionDTO)
                    });

                    if (response.status === 201) {
                        alert("¡Factura generada y cobrada con éxito!");
                        
                        // Limpiamos la memoria
                        localStorage.removeItem('rado_ultima_orden_id');
                        localStorage.removeItem('rado_estudios_orden_json');
                        localStorage.removeItem('rado_direccion');
                        localStorage.removeItem('rado_telefono');
                        localStorage.removeItem('rado_correo');
                        
                        // Redirigir al Dashboard
                        window.location.href = "dashboard.html";
                    } else {
                        const errorMsg = await response.text();
                        alert("Error al guardar la factura: " + errorMsg);
                    }
                } catch (error) {
                    console.error("Error crítico:", error);
                    alert("Error de conexión con el servidor backend.");
                }
            });
        }
    }
});

// =====================================================================
// GRÁFICO DINÁMICO DE PACIENTES ATENDIDOS (CHART.JS)
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('graficoPacientes');
    
    if (ctx) {
        // 1. Calcular dinámicamente los nombres de los últimos 7 días
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const etiquetasDias = [];
        
        for (let i = 6; i >= 0; i--) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - i);
            etiquetasDias.push(diasSemana[fecha.getDay()]);
        }

        // 2. Iniciar la gráfica con las etiquetas calculadas
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: etiquetasDias, // <-- Se inyectan los días dinámicos aquí
                datasets: [{
                    label: 'Pacientes',
                    data: [], // <-- Nace vacío, el fetch de Spring Boot lo llenará
                    borderColor: '#2D89EF', 
                    backgroundColor: 'rgba(45, 137, 239, 0.15)', 
                    borderWidth: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#2D89EF',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true, 
                    tension: 0.4 
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }, 
                    tooltip: {
                        backgroundColor: '#2D89EF',
                        titleFont: { family: 'Poppins', size: 13 },
                        bodyFont: { family: 'Poppins', size: 14, weight: 'bold' },
                        padding: 12,
                        displayColors: false, 
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + ' atendidos';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false,
                            color: '#f0f0f0', 
                        },
                        ticks: {
                            font: { family: 'Poppins', size: 11 },
                            color: '#a0a0a0',
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: { display: false }, 
                        ticks: {
                            font: { family: 'Poppins', size: 12 },
                            color: '#6c757d'
                        }
                    }
                }
            }
        });
    }
});

// =====================================================================
// FUNCIÓN PARA CERRAR SESIÓN DE FORMA SEGURA
// =====================================================================
function cerrarSesion() {
    // Borramos toda la memoria de seguridad del navegador
    localStorage.removeItem('rado_rol');
    localStorage.removeItem('rado_usuario_nombre');
    
    // Lo enviamos al login
    window.location.href = "index.html";
}

// =====================================================================
// MÓDULO DE GENERACIÓN DE REPORTES Y EXPORTACIÓN A EXCEL
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
    const btnPrevisualizar = document.getElementById('btnPrevisualizar');
    const btnExportar = document.getElementById('btnExportar');
    
    // Verificamos si estamos en la página de reportes
    if (btnPrevisualizar) {
        const selectTipo = document.getElementById('tipoReporte');
        const inputInicio = document.getElementById('fechaInicio');
        const inputFin = document.getElementById('fechaFin');
        
        const estadoVacio = document.getElementById('estadoVacio');
        const tablaResultados = document.getElementById('tablaResultados');
        const cabeceraReporte = document.getElementById('cabeceraReporte');
        const cuerpoReporte = document.getElementById('cuerpoReporte');
        const contadorRegistros = document.getElementById('contadorRegistros');

        // 1. LÓGICA DE PREVISUALIZAR
        btnPrevisualizar.addEventListener('click', async function() {
            const tipo = selectTipo.value;
            const fechaInicio = inputInicio.value;
            const fechaFin = inputFin.value;

            // Validación 1: Campos vacíos
            if (!tipo || !fechaInicio || !fechaFin) {
                return alert("⚠️ Por favor, seleccione el tipo de reporte y el rango completo de fechas.");
            }

            // Validación 2: EL ESCUDO CONTRA FECHAS INVERTIDAS
            if (fechaInicio > fechaFin) {
                return alert("❌ Error: La Fecha de Inicio no puede ser mayor que la Fecha Final.");
            }

            // Ocultamos el estado vacío y preparamos la tabla
            estadoVacio.style.display = 'none';
            tablaResultados.style.display = 'block';
            btnExportar.style.display = 'none'; // Se oculta hasta que carguen los datos
            
            cabeceraReporte.innerHTML = '';
            cuerpoReporte.innerHTML = '<tr><td colspan="10" class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Consultando la base de datos...</p></td></tr>';
            contadorRegistros.innerHTML = '';

            try {
                // LLAMADA REAL A LA API DE SPRING BOOT
                const response = await fetch(`http://localhost:8080/api/reportes/${tipo}?inicio=${fechaInicio}&fin=${fechaFin}`);
                
                if (!response.ok) throw new Error("Error en el servidor");
                
                const datosReales = await response.json();

                // DIBUJAR LAS TABLAS CON LOS DATOS DE MYSQL
                if (tipo === 'consolidado') {
                    dibujarTablaConsolidado(datosReales);
                } else if (tipo === 'facturacion') {
                    dibujarTablaFacturacion(datosReales);
                }

                // MOSTRAR BOTÓN EXPORTAR SI HAY DATOS
                if (datosReales.length > 0) {
                    btnExportar.style.display = 'inline-flex';
                    contadorRegistros.innerHTML = `Mostrando <strong>${datosReales.length}</strong> registros encontrados.`;
                } else {
                    cuerpoReporte.innerHTML = '<tr><td colspan="10" class="text-center py-4 text-muted">No se encontraron registros en este rango de fechas.</td></tr>';
                }

            } catch (error) {
                console.error("Error al cargar el reporte:", error);
                cuerpoReporte.innerHTML = '<tr><td colspan="10" class="text-center text-danger fw-bold py-4">Error de conexión con el servidor.</td></tr>';
            }
            
        });

        // 2. LÓGICA DE EXPORTAR A EXCEL (SheetJS)
        btnExportar.addEventListener('click', function() {
            const tablaElement = document.getElementById('tablaReporteFinal');
            
            // Convertimos la tabla HTML a un libro de Excel
            const workbook = XLSX.utils.table_to_book(tablaElement, { sheet: "Reporte" });
            
            // Generamos el nombre del archivo dinámico
            const nombreReporte = selectTipo.options[selectTipo.selectedIndex].text.replace(/ /g, '_');
            const fechaTxt = inputInicio.value.replace(/-/g, '');
            const nombreArchivo = `RADO_${nombreReporte}_${fechaTxt}.xlsx`;
            
            // Forzamos la descarga
            XLSX.writeFile(workbook, nombreArchivo);
        });

        // ==========================================
        // FUNCIONES DIBUJANTES DE TABLAS
        // ==========================================
        const formater = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

        function dibujarTablaConsolidado(datos) {
            cabeceraReporte.innerHTML = `
                <tr>
                    <th>Sede</th>
                    <th>Método de Pago</th>
                    <th class="text-end">Valor Total Agrupado</th>
                </tr>`;
            
            cuerpoReporte.innerHTML = '';
            datos.forEach(d => {
                cuerpoReporte.innerHTML += `
                    <tr>
                        <td class="fw-bold text-dark"><i class="bi bi-geo-alt text-primary me-1"></i> ${d.sede}</td>
                        <td><span class="badge bg-secondary bg-opacity-10 text-secondary border">${d.metodoPago || 'NO REGISTRA'}</span></td>
                        <!-- Aquí agregamos data-v y data-t para que exporte el número limpio a Excel -->
                        <td class="text-end text-success fw-bold" data-v="${d.total}" data-t="n">${formater.format(d.total)}</td>
                    </tr>`;
            });
        }

        function dibujarTablaFacturacion(datos) {
            cabeceraReporte.innerHTML = `
                <tr>
                    <th>Fecha</th>
                    <th>Documento</th>
                    <th>Nombre Paciente</th>
                    <th>Convenio</th>
                    <th>Referido Por</th>
                    <th>Factura</th>
                    <th>Descripción</th>
                    <th>Método Pago</th>
                    <th>Sede</th>
                    <th class="text-end">Valor</th>
                </tr>`;
            
            cuerpoReporte.innerHTML = '';
            datos.forEach(d => {
                cuerpoReporte.innerHTML += `
                    <tr>
                        <td class="text-muted">${d.fecha}</td>
                        <td class="text-muted">${d.idPaciente}</td>
                        <td class="fw-bold">${d.nombre}</td>
                        <td>${d.convenio}</td>
                        <td class="fst-italic text-muted">${d.referido || 'No Registra'}</td>
                        <td class="font-monospace text-primary fw-bold">${d.factura}</td>
                        <td class="small">${d.descripcion}</td>
                        <td>${d.metodoPago || 'NO REGISTRA'}</td>
                        <td>${d.sede}</td>
                        <!-- Aquí agregamos data-v y data-t para que exporte el número limpio a Excel -->
                        <td class="text-end text-success fw-bold" data-v="${d.valor}" data-t="n">${formater.format(d.valor)}</td>
                    </tr>`;
            });
        }
    }
});
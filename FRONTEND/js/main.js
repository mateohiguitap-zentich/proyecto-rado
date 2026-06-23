// CALCULAR EDAD SEGÚN LA FECHA DE NACIMIENTO EN LA SECCIÓN DE REGISTRO DE PACIENTE

document.getElementById('fechaNacimiento').addEventListener('change', function() {
            const fechaNac = new Date(this.value);
            const hoy = new Date();
            if (isNaN(fechaNac.getTime())) return;
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) { edad--; }
            document.getElementById('displayEdad').value = edad + (edad === 1 ? " año" : " años");
        });

// BOTÓN AGREGAR ESTUDIO EN LA SECCIÓN ORDEN VIRTUAL

document.addEventListener("DOMContentLoaded", function() {
        // Seleccionamos los elementos del HTML
        const inputEstudio = document.getElementById('inputEstudio');
        const btnAgregar = document.getElementById('btnAgregarEstudio');
        const contenedor = document.getElementById('contenedorEstudios');
        const placeholder = document.getElementById('textoPlaceholder');

        // Función para agregar el estudio
        function agregarEstudio() {
            const nombreEstudio = inputEstudio.value.trim(); // Obtenemos el texto
            
            // Si el input está vacío, no hacemos nada
            if (nombreEstudio === "") return;

            // Ocultamos el texto de "Los estudios aparecerán aquí..."
            if (placeholder) placeholder.style.display = 'none';

            // Creamos la nueva etiqueta (badge) para el estudio
            const badge = document.createElement('div');
            badge.className = 'badge bg-white text-dark border p-2 shadow-sm d-inline-flex align-items-center';
            badge.innerHTML = `
                ${nombreEstudio} 
                <i class="bi bi-x-circle-fill text-danger ms-2" style="cursor: pointer; font-size: 1.1rem;" title="Eliminar estudio"></i>
            `;

            // Le damos la funcionalidad al botón de la "X" roja para borrar el estudio
            const btnEliminar = badge.querySelector('i');
            btnEliminar.addEventListener('click', function() {
                badge.remove(); // Borra la etiqueta
                
                // Si ya no quedan etiquetas, volvemos a mostrar el texto gris
                if (contenedor.querySelectorAll('.badge').length === 0) {
                    if (placeholder) placeholder.style.display = 'block';
                }
            });

            // Agregamos la etiqueta al cuadro gris
            contenedor.appendChild(badge);

            // Limpiamos el input para escribir el siguiente y lo mantenemos seleccionado
            inputEstudio.value = '';
            inputEstudio.focus();
        }

        // Ejecutar la función cuando hacemos clic en el botón "Agregar"
        btnAgregar.addEventListener('click', agregarEstudio);

        // Ejecutar la función también si presionamos la tecla "Enter"
        inputEstudio.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Evita que la página se recargue por accidente
                agregarEstudio();
            }
        });
    });
// Array para almacenar los nombres
let amigos = [];

// Array para almacenar las asignaciones de amigos secretos
let asignaciones = [];

// Estado de si ya se realizó el sorteo
let sorteoRealizado = false;

// Índice para controlar qué resultado mostrar
let indiceResultadoActual = 0;

//Límite máximo de caracteres
const max_caract = 20;

//Ocultar botones de eliminar y reiniciar
document.getElementById('eliminar').style.display = 'none';
document.getElementById('reiniciarButton').style.display = 'none';
document.getElementById('nuevoSorteoButton').style.display = 'none';

// Función para agregar un amigo a la lista
function agregarAmigo() {

    const inputAmigo = document.getElementById('amigo');
    const nombreAmigo = inputAmigo.value.trim();
    
    // Validar que el campo no esté vacío
    if (nombreAmigo === '') {
        alert('Por favor, inserte un nombre');
        return;
    }
    
    // Validar max de caracteres

    if (nombreAmigo.length > max_caract) {
        alert(`El nombre no puede exceder los "${max_caract}" caracteres`);
        return;
    }


    // Validar que el nombre no esté repetido
    if (amigos.includes(nombreAmigo)) {
        alert('Este nombre ya fue ingresado');
        return;
    }
    
    // Si es válido, añadirlo al arreglo
    amigos.push(nombreAmigo);
    
    // Limpiar el campo de entrada
    inputAmigo.value = '';
    
    // Actualizar la lista visual de amigos
    actualizarListaAmigos();
    
    // Enfocar el campo de entrada para el siguiente nombre
    inputAmigo.focus();

    // Agregar botones de eliminar y reiniciar
    document.getElementById('eliminar').style.display = 'flex'

    if(amigos.length >1 ){
    document.getElementById('reiniciarButton').style.display = 'flex'
    }
}

// Función para realizar un nuevo sorteo con la misma lista
function nuevoSorteo() {
    if (amigos.length < 2) {
        alert('Se necesitan al menos 2 nombres para realizar el sorteo');
        return;
    }
    
    // Realizar una nueva asignación
    asignaciones = asignarAmigosSecretos(amigos);
    
    // Reiniciar el contador de resultados
    indiceResultadoActual = 0;
    
    // Limpiar resultados previos
    document.getElementById('resultado').innerHTML = '';
    
    // Mostrar el primer resultado
    mostrarSiguienteResultado();
}


// Función para eliminar el último amigo de la lista
function eliminarUltimo() {

    // Verificar que haya al menos uno en la lista
    if (amigos.length === 0) {
        alert('No hay nombres para eliminar');
        return;
    }
    
    
    // Eliminar el último elemento del array
    const nombreEliminado = amigos.pop();
    
    // Actualizar la lista visual
    actualizarListaAmigos();
    
    // Mostrar confirmación
    alert(`Se ha eliminado "${nombreEliminado}" de la lista`);

    // Si ya había un sorteo realizado, invalidarlo
    if (sorteoRealizado) {
        sorteoRealizado = false;
        document.getElementById('resultado').innerHTML = '';
        indiceResultadoActual = 0;
    }
    
    if(amigos.length === 0){
            document.getElementById('eliminar').style.display = 'none'
    document.getElementById('reiniciarButton').style.display = 'none'
    document.getElementById('nuevoSorteoButton').style.display = 'none';
    }
}

// Función para actualizar la lista visual de amigos
function actualizarListaAmigos() {
    const listaAmigos = document.getElementById('listaAmigos');
    listaAmigos.innerHTML = '';
    
    // Crear un elemento de lista para cada amigo
    amigos.forEach(amigo => {
        const li = document.createElement('li');
        li.textContent = amigo;
        listaAmigos.appendChild(li);
    });
}

// Función para sortear y asignar amigos secretos
function sortearAmigo() {
    // Comprobar que el array no esté vacío
    if (amigos.length === 0) {
        alert('Introduzca nombres para iniciar el sorteo');
        return;
    }
    
    // Comprobar que hay al menos 2 nombres para hacer el sorteo
    if (amigos.length < 2) {
        alert('Se necesitan al menos 2 nombres para realizar el sorteo');
        return;
    }
    
    // Si no se ha realizado un sorteo todavía, realizar la asignación
    if (!sorteoRealizado) {
        // Realizar el algoritmo de asignación
        asignaciones = asignarAmigosSecretos(amigos);
        sorteoRealizado = true;
        indiceResultadoActual = 0;
        
        // Indicar que el sorteo está realizado y mostrar botón para nuevo sorteo
        document.getElementById('nuevoSorteoButton').style.display = 'flex';
    }
    
    // Mostrar el siguiente resultado si hay asignaciones pendientes
    mostrarSiguienteResultado();
}

// Función para mostrar el siguiente resultado individual
function mostrarSiguienteResultado() {
    const resultado = document.getElementById('resultado');
    
    // Si ya se mostraron todos los resultados, reiniciar
    if (indiceResultadoActual >= asignaciones.length) {
        alert('Ya se han mostrado todos los amigos secretos. Presione "Reiniciar" para hacer un nuevo sorteo o "Sortear de nuevo" para realizar otro sorteo con los mismos nombres.');
        return;
    }
    
    // Limpiar resultados anteriores
    resultado.innerHTML = '';

    // Crear elemento para la asignación actual
    const asignacionActual = asignaciones[indiceResultadoActual];
    const li = document.createElement('li');
    li.innerHTML = `${asignacionActual.amigo}, tu amigo secreto es: <strong>${asignacionActual.amigoSecreto}</strong>`;
    resultado.appendChild(li);
    
    // Agregar indicador de progreso
    const progress = document.createElement('li');
    progress.className = 'progress-indicator';
    progress.innerHTML = `Asignación ${indiceResultadoActual + 1} de ${asignaciones.length}`;
    resultado.appendChild(progress);
    
    // Incrementar el índice para la próxima vez
    indiceResultadoActual++;
}

// Función para asignar amigos secretos
function asignarAmigosSecretos(listaAmigos) {

    // Crear un array para las asignaciones
    let asignaciones = [];
    
    // Crear copia de la lista de amigos para trabajar
    let candidatos = [...listaAmigos];
    
    // Número de intentos máximos para evitar bucles infinitos
    let maxIntentos = 50;
    
    // Intentar crear un emparejamiento válido
    while (maxIntentos > 0) {
        asignaciones = [];
        // Crear copia fresca para cada intento
        let disponibles = [...listaAmigos];
        let valido = true;
        
        // Para cada amigo en la lista original
        for (let i = 0; i < listaAmigos.length; i++) {
            const amigoActual = listaAmigos[i];
            
            // Filtrar la lista de disponibles (quitar el amigo actual)
            let filtrados = disponibles.filter(amigo => amigo !== amigoActual);
            
            // Si no quedan amigos disponibles para asignar, este intento no es válido
            if (filtrados.length === 0) {
                valido = false;
                break;
            }
            
            // Seleccionar un amigo secreto aleatorio entre los disponibles
            const indiceAleatorio = Math.floor(Math.random() * filtrados.length);
            const amigoSecreto = filtrados[indiceAleatorio];
            
            // Guardar la asignación
            asignaciones.push({
                amigo: amigoActual,
                amigoSecreto: amigoSecreto
            });
            
            // Eliminar el amigo secreto de los disponibles para futuros emparejamientos
            disponibles = disponibles.filter(amigo => amigo !== amigoSecreto);
        }
        
        // Si todas las asignaciones son válidas, salir del bucle
        if (valido) {
            break;
        }
        
        maxIntentos--;
    }
    
    // Validar que todos tengan asignación
    if (asignaciones.length !== listaAmigos.length) {
        console.error("No se pudo completar la asignación");
        return [];
    }
    
    return asignaciones;
}

// Función para reiniciar el sorteo
function reiniciarSorteo() {
    // Limpiar el array de amigos
    amigos = [];

    // Limpiar el array de asignaciones
    asignaciones = [];
        
    // Restablecer estado del sorteo
    sorteoRealizado = false;

    // Reiniciar índice de resultados
    indiceResultadoActual = 0;
    
    // Limpiar la lista visual de amigos
    document.getElementById('listaAmigos').innerHTML = '';
    
    // Limpiar el resultado
    document.getElementById('resultado').innerHTML = '';
    
    // Limpiar el campo de entrada
    document.getElementById('amigo').value = '';

    // Ocultar botón de nuevo sorteo
    document.getElementById('nuevoSorteoButton').style.display = 'none';
    
    // Enfocar el campo de entrada
    document.getElementById('amigo').focus();

    document.getElementById('reiniciarButton').style.display = 'none';

    document.getElementById('eliminar').style.display = 'none'
}

// Evento para permitir añadir amigos presionando Enter
document.getElementById('amigo').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        agregarAmigo();
    }
});

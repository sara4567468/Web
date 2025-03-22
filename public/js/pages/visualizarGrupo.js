function fetchTareas(){
  var group_id=sessionStorage.getItem('group_id');
  fetch('http://localhost:3000/listarTareas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      group_id: group_id
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.tareas && data.tareas.length > 0) {
        let table = document.getElementById("tareasTable").getElementsByTagName('tbody')[0];
        data.tareas.forEach((tarea) => {
          let row = table.insertRow();
          let cell1 = row.insertCell(0);
          let cell2 = row.insertCell(1);
          let cell3 = row.insertCell(2);
          let cell4 = row.insertCell(3);
          cell1.innerHTML = tarea.titulo;
          cell2.innerHTML = tarea.descripcion;
          cell3.innerHTML = tarea.fecha_inicio;
          cell4.innerHTML = tarea.fecha_final;
        })
      } else { console.log("No hay tareas asignadas."); }
    })
    .catch((error) => console.error('Error al cargar tareas:', error));
}
function fetchEstudiantes(){
  var group_id=sessionStorage.getItem('group_id');
  fetch('http://localhost:3000/listarEstudiantes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      group_id: group_id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.estudiantes && data.estudiantes.length > 0) {
        let table = document.getElementById("estudiantesTable").getElementsByTagName('tbody')[0];
        data.estudiantes.forEach((estudiante) => {
          let row = table.insertRow();
          let cell1 = row.insertCell(0);
          cell1.innerHTML = estudiante.user_id;
        })
      } else { console.log("No hay esetudiantes inscritos."); }
    })
    .catch((error) => console.error('Error al cargar estudiantes:', error));
}
window.onload = function(){
  fetchEstudiantes();
  fetchTareas();
  const asignarTareaBtn = document.getElementById('asignarTareaBtn');
  asignarTareaBtn.addEventListener('click', function () {
    window.location.href = 'asignarTarea.html';
  });
};

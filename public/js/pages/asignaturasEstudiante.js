async function fetchEntregasProximas(){
  const user_id=sessionStorage.getItem('user');
  try{
    const response=await fetch('http://localhost:3000/entregasProximas',{
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body:JSON.stringify({user_id:user_id}),
    });
    if(!response.ok){
      throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
    }
    const data=await response.json();
    if(data.data.entregas_id && data.data.tareas_id){
      data.data.tareas_id.forEach(tarea_id=>{
        data.data.entregas_id.forEach(entrega_id=>{
          console.log(entrega_id,tarea_id);
          if(tarea_id===entrega_id){
            console.log("si");
          }else{
            console.log("falta la",tarea_id);
          }
        })
      });
    }else{
      console.log("No se encontraron tareas o entregas.");
    }
  }catch(error){
    console.error('Error al obtener entregas próximas:',error);
  }
}
function fetchAsignaturas(){
  const user=sessionStorage.getItem('user');
  const passwd=sessionStorage.getItem('passwd');
  fetch('http://localhost:3000/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      user:user,
      passwd:passwd,
    }),
  })
  .then((response)=>response.json())
  .then((data)=>{
    console.log("data:",data);
    if(data.asignaturas && data.asignaturas.length>0){
      let table=document.getElementById("asignaturasTable").getElementsByTagName('tbody')[0];
      data.asignaturas.forEach((asignatura)=>{
        let row=table.insertRow();
        let cell1=row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML=asignatura.group_id;
        cell2.innerHTML=asignatura.nombre;
        cell2.style.cursor='pointer'
        cell2.onclick=function(){
          sessionStorage.setItem('group_id',asignatura.group_id);
          window.location.href='visualizarAsignatura.html';
        }
      });
    }else{
      console.log("No hay asignaturas inscritas.");
    }
  })
  .catch((error)=>console.error('Error al cargar las asignatura:',error));
}
window.onload=function(){
  fetchEntregasProximas();
  fetchAsignaturas();
};

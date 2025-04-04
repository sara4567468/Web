document.getElementById('entregarTareaForm').addEventListener('submit',function(event){
    event.preventDefault()
    const tarea_id=sessionStorage.getItem('tarea_id')
    const user_id=sessionStorage.getItem('user')
    const fecha_entrega=new Date()
    fecha_entrega.setDate(fecha_entrega.getDate())
    const fechaEntregaFormateada=fecha_entrega.toISOString().slice(0,19).replace('T',' ')
    document.getElementById('tarea_id').value=tarea_id
    document.getElementById('user_id').value=user_id
    document.getElementById('fecha_entrega').value=fechaEntregaFormateada
    const entregarTareaForm=new FormData(this)
    fetch('http://localhost:3000/crearEntrega',{
        method:'POST',
        body:entregarTareaForm
    })
    .then(response=>{
        if(!response.ok){
            throw new Error('Error al subir el archivo')
        }
        return response.text()
    })
    .then(data=>{
        console.log(data)
        alert('Archivo subido exitosamente')
        window.history.back()
    })
    .catch(error=>{
        console.error('Error:',error)
        alert('Error al subir el archivo')
    })
})

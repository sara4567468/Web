const express=require("express")
const multer=require('multer')
const bodyParser=require("body-parser")
const cors=require("cors")
const app=express()
const port=3000
const storage=multer.memoryStorage()
const upload=multer({storage:storage})
const{
  verifyUser,
  getGruposByProfesor,
  getAsignaturasByEstudiante,
  getTareasByAsignatura,
  getEstudiantesByGrupo,
  asignarTareaQuery,
  inscribirEstudianteQuery,
  isProfesorQuery,
  isGrupoQuery,
  crearGrupoQuery,
  verEntregasQuery,
  editarTareaQuery,
  eliminarTareaQuery,
  crearEntregaQuery,
  isEntregadaQuery,
  entregasProximasQuery,
}=require("./dbQueries/dbQueries")
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.post("/login",async(req,res)=>{
  const {user,passwd}=req.body
  try{
    results=await verifyUser(user,passwd)
    if(results.length>0){
      const userType=results[0].rol
      console.log("Tipo de Usuario:",userType)
      if(userType==="profesor"){
        getGruposByProfesor(user,(err,grupos)=>{
          if(err){
            console.error("Error al consultar los grupos:",err)
          }
          if(grupos.length>0){
            return res.send({
              redirect:"pages/gruposProfesor.html",
              grupos:grupos,
            })
          }else{
            return res.send({
              redirect:"pages/gruposProfesor.html",
              grupos:[],
            })
          }
        })
      }else if(userType==="estudiante"){
        getAsignaturasByEstudiante(user,(err,asignaturas)=>{
          if(err){
            console.error("Error al consultar las asignaturas:",err)
          }
          if(asignaturas.length>0){
            return res.send({
              redirect:"pages/asignaturasEstudiante.html",
              asignaturas:asignaturas,
            })
          }else{
            return res.send({
              redirect:"pages/asignaturasEstudiante.html",
              asignaturas:[],
            })
          }
        })
      }
    }else{
      return res.send({error:"Usuario o Contraseña Incorrectos."})
    }
  }catch(err){
    console.error("Error al consultar la base de datos:",err)
  }
})
app.post("/listarTareas",async(req,res)=>{
  const group_id=req.body.group_id
  try{
    data=await getTareasByAsignatura(group_id)
    if(data.length>0){
      return res.send({
        tareas:data,
      })
    }else{
      return res.send({
        tareas:[],
      })
    }
  }catch(err){
    console.log("Error al consultar las tareas")
  }
})
app.post("/listarEstudiantes",async(req,res)=>{
  const group_id=req.body.group_id
  try{
    const data=await getEstudiantesByGrupo(group_id)
    console.log(data)
    if(data.length>0){
      return res.send({estudiantes:data,})
    }else{
      return res.send({estudiantes:[],})
    }
  }catch(err){
    console.error("Error al listar estudiantes del grupo.")
    return res.status(500).send({message:'Error al listar estudiantes del grupo.'})
  }
})
app.post("/asignarTarea",async(req,res)=>{
  const titulo=req.body.titulo
  const descripcion=req.body.descripcion
  const fecha_inicio=req.body.fecha_inicio
  const fecha_final=req.body.fecha_final
  const group_id=req.body.group_id
  try{
    const data=await asignarTareaQuery(titulo,descripcion,fecha_inicio,fecha_final,group_id)
    return res.send({success:true})
  }catch(err){
    console.error("Error al insertar la asignatura en la base de datos.")
    return res.send({success:false})
  }
})
app.post("/inscribirEstudiante",async(req,res)=>{
  const user_id=req.body.estudiante_id
  const group_id=req.body.group_id
  try{
    const data=await isProfesorQuery(user_id)
    if(data.length===0){
      return res.send({message:'No existe tal usuario en la institucion.'})
    }
    if(data[0].rol==='estudiante'){
      inscribirEstudianteQuery(user_id,group_id,(err,data)=>{
        if(err){
          console.log("Error al inscribir estudiante a db")
          return res.send({message:'Error al inscribir estudiante a db.'})
        }
        return res.send({message:'Estudiante inscrito correctamente.'})
      })
    }else if(data[0].rol==='profesor'){
      return res.send({message:'Error: El usuario ingresado es de un profesor.'})
    }
  }catch(err){
    return res.send({message:'Error al insertar estudiante.'})
  }
})
app.post("/crearGrupo",async(req,res)=>{
  const nombre=req.body.nombre
  const profesor=req.body.profesor
  try{
    const data=await isGrupoQuery(nombre)
    if(data.length===0){
      crearGrupoQuery(nombre,profesor,(err,data)=>{
        if(err){
          return res.send({message:'Error al crear grupo.'})
        }else{
          return res.send({message:'Grupo creado correctamente.'})
        }
      })
    }else{
      return res.send({message:'Ya existe un grupo con este nombre por favor utilizar otro nombre.'})
    }
  }catch(err){
      res.send({message:'Error al consultar grupos.'})
  }
})
app.post('/verEntregas',async(req,res)=>{
  const tarea_id=req.body.tarea_id
  try{
    const entregas=await verEntregasQuery(tarea_id)
    return res.send({entregas:entregas})
  }catch(err){
    console.error('Error al consultar entregas: ',err)
    return res.status(500).send({message:'Error al consultar entregas.'})
  }
})
app.post('/editarTarea',async(req,res)=>{
  const tarea_id=req.body.tarea_id
  const titulo=req.body.titulo
  const descripcion=req.body.descripcion
  const fecha_inicio=req.body.fecha_inicio
  const fecha_final=req.body.fecha_final
  try{
    const data=await editarTareaQuery(tarea_id,titulo,descripcion,fecha_inicio,fecha_final)
    return res.send({message:'Tarea editada correctamente.',data})
  }catch(err){
    console.error('Error al editar tarea:',err)
    return res.status(500).send({message:'Error al editar tarea.'})
  }
})
app.post('/eliminarTarea',async(req,res)=>{
  const tarea_id=req.body.tarea_id
  try{
    const data=await eliminarTareaQuery(tarea_id)
    return res.send({message:'Tarea eliminada correctamente.'})
  }catch(err){
    return res.status(500).send({message:'Error al editar tarea.'})
  }
})
app.post('/crearEntrega',upload.single('archivo_entrega'),async(req,res)=>{
  const tarea_id=parseInt(req.body.tarea_id,10)
  const user_id=parseInt(req.body.user_id,10)
  const fecha_entrega=req.body.fecha_entrega
  const nombre=req.file.originalname
  const archivo_entrega=req.file.buffer
  try{
    const data=await crearEntregaQuery(tarea_id,user_id,fecha_entrega,nombre,archivo_entrega)
    return res.send({message:'Tarea entregada correctamente.',data})
  }catch(err){
    console.error('Error al entregar tarea:',err)
    return res.status(500).send({message:'Error al entregar tarea.'})
  }
})
app.post('/isEntregada',async(req,res)=>{
  const tarea_id=req.body.tarea_id
  const user_id=req.body.user_id
  try{
    const data=await isEntregadaQuery(tarea_id,user_id)
    if(data.length>0){
      return res.send({success:true})
    }else{
      return res.send({success:false})
    }
  }catch(err){
    console.error('Error al consultar isEntregada: ',err)
    return res.status(500).send({failture:true})
  }
})
app.post('/entregasProximas',async(req,res)=>{
  const user_id=req.body.user_id
  const group_id=req.body.group_id
  try{
    const data=await entregasProximasQuery(user_id,group_id)
    if(data.length>0){
      return res.send({success:true,data:data})
    }else{
      return res.send({success:false})
    }
  }catch(err){
    console.error('Error al consultar entregas proximas: ',err)
    return res.status(500).send({success:false})
  }
})
app.listen(port,()=>{
  console.log(`Servidor escuchando en http://localhost:${port}`)
})

const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const app=express();
const port=3000;
const {verifyUser,getGruposByProfesor,getAsignaturasByEstudiante,getTareasByAsignatura,getEstudiantesByGrupo}=require("./dbQueries/dbQueries");
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// Endpoint para manejar el login
app.post("/login",(req,res)=>{
  const {user,passwd}=req.body;
  // Verificar las credenciales del usuario
  verifyUser(user,passwd,(err,results)=>{
    if(err){
      console.error("Error al consultar la base de datos:",err);
    }
    if(results.length>0){
      const userType=results[0].rol;
      console.log("Tipo de Usuario:",userType);
      if(userType==="profesor"){
        getGruposByProfesor(user,(err,grupos)=>{
          if(err){
            console.error("Error al consultar los grupos:",err);
          }
          if(grupos.length>0){
            res.send({
              redirect:"pages/gruposProfesor.html",
              grupos:grupos,
            });
          }else{
            // Enviar una lista vacía si no hay grupos
            res.send({
              redirect:"pages/gruposProfesor.html",
              grupos:[],
            });
          }
        });
      }else if(userType==="estudiante"){
        getAsignaturasByEstudiante(user,(err,asignaturas)=>{
          if(err){
            console.error("Error al consultar las asignaturas: ",err);
          }
          if (asignaturas.length > 0) {
            res.send({
              redirect:"pages/asignaturasEstudiante.html",
              asignaturas:asignaturas,
            });
          } else {
            res.send({
              redirect: "pages/asignaturasEstudiante.html",
              asignaturas: [],
            });
          }
        });
      }
    }else{
      res.send({error:"Usuario o Contraseña Incorrectos."});
    }
  });
});
app.post("/listarTareas",(req,res)=>{
  const group_id=req.body.group_id;
  getTareasByAsignatura(group_id,(err,tareas)=>{
    if(err){
      console.log("Error al consultar las tareas");
    }
    if(tareas.length>0){
      res.send({
        tareas: tareas,
      });
    }else{
      res.send({
        tareas: [],
      });
    }
  });
});
app.post("/listarEstudiantes",(req,res)=>{
  const group_id=req.body.group_id;
  getEstudiantesByGrupo(group_id,(err,estudiantes)=>{
    if(err){
      console.log("Error al consultar estudiantes");
    }
    if(estudiantes.length>0){
      res.send({
        estudiantes: estudiantes,
      });
    }else{
      res.send({
        estudiantes: [],
      });
    }
  });
});
// Iniciar el servidor
app.listen(port,()=>{
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

const mysql=require("mysql2");

const connection=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"db_entrega_de_tareas",
});
const verifyUser=(user,passwd,callback)=>{
  const query="SELECT * FROM Usuarios WHERE user_id = ? AND passwd = ?";
  connection.execute(query,[user,passwd],(err,results)=>{
    if(err){
      return callback(err,null);
    }
    callback(null,results);
  });
};
const getGruposByProfesor=(profesor,callback)=>{
  const query="SELECT * FROM Grupos WHERE profesor = ?";
  connection.execute(query,[profesor],(err,results)=>{
    if(err){
      return callback(err,null);
    }
    callback(null,results);
  });
};
const getAsignaturasByEstudiante=(estudiante,callback)=>{
  const query="SELECT Estudiantes_por_Grupo.*, Grupos.nombre AS nombre FROM Estudiantes_por_Grupo INNER JOIN Grupos ON Estudiantes_por_Grupo.group_id = Grupos.group_id WHERE Estudiantes_por_Grupo.user_id=?;";
  connection.execute(query,[estudiante],(err,results)=>{
    if(err){
      return callback(err, null);
    }
    callback(null,results);
  })
}
const getTareasByAsignatura=(group_id,callback)=>{
  const query="SELECT * FROM Tareas WHERE group_id=?";
  connection.execute(query,[group_id],(err,results)=>{
    if(err){
      return callback(err,null);
    }
    callback(null,results);
  })
}
const getEstudiantesByGrupo=(group_id,callback)=>{
  const query="SELECT * FROM Estudiantes_por_Grupo WHERE group_id=?";
  connection.execute(query,[group_id],(err,results)=>{
    if(err){
      return callback(err,null);
    }
    callback(null,results);
  })
}
module.exports={
  verifyUser,
  getGruposByProfesor,
  getAsignaturasByEstudiante,
  getTareasByAsignatura,
  getEstudiantesByGrupo,
};

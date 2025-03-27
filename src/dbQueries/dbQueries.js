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
const asignarTareaQuery=(titulo,descripcion,fecha_inicio,fecha_final,group_id,callback)=>{
  const query="INSERT INTO Tareas(titulo,descripcion,fecha_inicio,fecha_final,group_id) VALUES(?,?,?,?,?);";
  connection.execute(query,[titulo,descripcion,fecha_inicio,fecha_final,group_id],(err,results)=>{
    if(err){
      return callback(err, null);
    }
    return callback(null,results);
  })
}
const isProfesorQuery=(user_id,callback)=>{
  const query="SELECT * FROM Usuarios WHERE user_id=?";
  connection.execute(query,[user_id],(err,results)=>{
    if(err){
      return callback(err, null);
    }
    return callback(null,results);
  })
}
const isGrupoQuery=(nombre,callback)=>{
  const query="SELECT * FROM Grupos WHERE nombre=?";
  connection.execute(query,[nombre],(err,results)=>{
    if(err){
      return callback(err, null);
    }
    return callback(null,results);
  })
}
const inscribirEstudianteQuery=(user_id,group_id,callback)=>{
  const query="SELECT * FROM Estudiantes_por_Grupo WHERE user_id=? AND group_id=?";
  connection.execute(query,[user_id,group_id],(err,results)=>{
    if(err){
      return callback(err, null);
    }
    if(results.length>0){
      return callback(null,results);
    }else{
      const query2="INSERT INTO Estudiantes_por_Grupo(user_id,group_id) VALUES(?,?);";
      connection.execute(query2,[user_id,group_id],(err,results)=>{
        if(err){
          return callback(err, null);
        }
        return callback(null,results);
      })
    }
  })
}
const crearGrupoQuery=(nombre,user_id,callback)=>{
  const query="INSERT INTO Grupos(nombre,profesor) VALUES(?,?);";
  connection.execute(query,[nombre,user_id],(err,results)=>{
    if(err){
      return callback(err,null);
    }else{
      return callback(null,results);
    }
  })
}
const verEntregasQuery=(tarea_id,callback)=>{
  const query="SELECT * FROM Entregas WHERE tarea_id=?";
  return new Promise((resolve,reject)=>{
    connection.execute(query,[tarea_id],(err,results)=>{
      if(err) return reject(err);
      resolve(results);
    })
  })
}
const editarTareaQuery=(tarea_id, titulo, descripcion, fecha_inicio, fecha_final, callback) => {
  const query="UPDATE Tareas SET titulo=?,descripcion=?,fecha_inicio=?,fecha_final=? WHERE tarea_id=?";
  return new Promise((resolve,reject)=>{
    connection.execute(query,[titulo,descripcion,fecha_inicio,fecha_final,tarea_id],(err, results) => {
      if(err) return reject(err);
      resolve(results);
    })
  })
}
const crearEntregaQuery=(tarea_id,user_id,fecha_entrega,nombre,archivo_entrega,callback)=>{
  const query="INSERT INTO Entregas(tarea_id,user_id,fecha_entrega,nombre,archivo_entrega) VALUES(?,?,?,?,?);";
  return new Promise((resolve,reject)=>{
    connection.execute(query,[tarea_id,user_id,fecha_entrega,nombre,archivo_entrega],(err,results)=>{
      if(err) return reject(err);
      resolve(results);
    })
  })
}
const isEntregadaQuery=(tarea_id,user_id,callback)=>{
  const query = "SELECT * FROM Entregas WHERE tarea_id=? AND user_id=?";
  return new Promise((resolve,reject)=>{
    connection.execute(query,[tarea_id,user_id],(err,results)=>{
      if (err) return reject(err);
      resolve(results);
    })
  })
}
const entregasProximasQuery = (user_id) => {
  const query0 = "SELECT * FROM Estudiantes_por_Grupo WHERE user_id=?";
  return new Promise((resolve, reject) => {
    connection.execute(query0, [user_id], (err, results1) => {
      if (err) return reject(err);
      const group_ids = results1.map(result => result.group_id); // Cambiado a group_id
      const query1 = "SELECT * FROM Tareas WHERE group_id=?";
      // Crear un array de promesas para las tareas
      const tareasPromises = group_ids.map(group_id => {
        return new Promise((resolve, reject) => {
          connection.execute(query1, [group_id], (err, results2) => {
            if (err) return reject(err);
            resolve(results2);
          });
        });
      });
      Promise.all(tareasPromises).then(tareasResults => {
        const tareas_id = tareasResults.flat().map(tarea => tarea.tarea_id); // Extraer tarea_id
        const query2 = "SELECT * FROM Entregas WHERE tarea_id=? AND user_id=?";
        // Crear un array de promesas para las entregas
        const entregasPromises = tareas_id.map(tarea_id => {
          return new Promise((resolve, reject) => {
            connection.execute(query2, [tarea_id,user_id], (err, results3) => {
              if (err) return reject(err);
              resolve(results3);
            });
          });
        });
        Promise.all(entregasPromises).then(entregasResults => {
          const entregas_id = entregasResults.flat().map(entrega => entrega.tarea_id); // Aplanar el array de resultados
          resolve({group_ids,tareas_id, entregas_id }); // Devolver un objeto con los resultados
        }).catch(reject);
      }).catch(reject);
    });
  });
};
const eliminarTareaQuery=(tarea_id,callback)=>{
  const query="DELETE FROM Entregas WHERE tarea_id=?;";
  connection.execute(query,[tarea_id],(err,results)=>{
    if(err){
      return callback(err, null);
    }
    const query1="DELETE FROM Tareas WHERE tarea_id=?";
    connection.execute(query1,[tarea_id],(err,results)=>{
      if(err){
        return callback(err, null);
      }else{
        return callback(null,results)
      }
    })
  })
}
module.exports={
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
};

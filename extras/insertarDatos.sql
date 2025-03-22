INSERT INTO Usuarios(user_id,passwd,rol)
VALUES(1019986037,"gcc","profesor");
INSERT INTO Usuarios(user_id,passwd,rol)
VALUES(1019987036,"no","estudiante");
INSERT INTO Grupos(nombre,profesor)
VALUES("Quimica",1019986037);
INSERT INTO Grupos(nombre,profesor)
VALUES("Programacion Lineal",1019986037);
INSERT INTO Grupos(nombre,profesor)
VALUES("Catedra Unilibrista",1019986037);
INSERT INTO Grupos(nombre,profesor)
VALUES("Matematicas Discretas",1019986037);
INSERT INTO Estudiantes_por_Grupo(user_id,group_id)
VALUES(1019987036,1);
INSERT INTO Estudiantes_por_Grupo(user_id,group_id)
VALUES(1019987036,2);
INSERT INTO Estudiantes_por_Grupo(user_id,group_id)
VALUES(1019987036,3);
INSERT INTO Estudiantes_por_Grupo(user_id,group_id)
VALUES(1019987036,4);

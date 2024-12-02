drop database IF EXISTS evaluacion_docente;

CREATE DATABASE IF NOT EXISTS evaluacion_docente;
USE evaluacion_docente;

-- Tabla Academia
CREATE TABLE Academia (
    academia_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    academia_nombre VARCHAR(100),
    academia_descripcion TEXT,
    academia_activo TINYINT(1) CHECK (academia_activo IN (1, 0)),
    academia_fecha_de_creacion DATE
);

-- Tabla Departamento Académico
CREATE TABLE Departamento_Academico (
    departamento_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    departamento_nombre VARCHAR(100),
    departamento_descripcion TEXT,
    departamento_academia_id INT,
    departamento_fecha_de_creacion DATE,
    departamento_activo TINYINT(1) CHECK (departamento_activo IN (1, 0)),
    FOREIGN KEY (departamento_academia_id) REFERENCES Academia(academia_id)
);

-- Tabla Carreras
CREATE TABLE Carreras(
    carrera_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    carrera_nombre VARCHAR(100),
    carrera_clave VARCHAR(10) UNIQUE
);

-- Tabla Roles
CREATE TABLE Roles (
    rol_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    rol_nombre VARCHAR(50) UNIQUE,
    rol_descripcion TEXT
);

-- Tabla Usuarios (unificada para profesores, estudiantes y administradores)
CREATE TABLE Usuarios (
    usuario_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_nombres VARCHAR(100),
    usuario_apellido_paterno VARCHAR(50),
    usuario_apellido_materno VARCHAR(50),
    usuario_clave VARCHAR(10) UNIQUE,
    usuario_password VARCHAR(255),
    usuario_fecha_nacimiento DATE,
    usuario_genero ENUM('M', 'F', 'O'),
    usuario_activo TINYINT(1) CHECK (usuario_activo IN (1, 0)),
    usuario_fecha_alta DATE,
    usuario_fecha_baja DATE,
    usuario_rol_id INT,
    usuario_carrera_id INT DEFAULT NULL,
    usuario_academia_id INT DEFAULT NULL,
    usuario_departamento_id INT DEFAULT NULL,
    FOREIGN KEY (usuario_rol_id) REFERENCES Roles(rol_id),
    FOREIGN KEY (usuario_carrera_id) REFERENCES Carreras(carrera_id),
    FOREIGN KEY (usuario_academia_id) REFERENCES Academia(academia_id),
    FOREIGN KEY (usuario_departamento_id) REFERENCES Departamento_Academico(departamento_id)
);

-- Tabla Ciclo Escolar
CREATE TABLE Ciclo_Escolar (
    ciclo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ciclo_nombre VARCHAR(50),
    ciclo_inicio DATE,
    ciclo_final DATE,
    ciclo_activo TINYINT(1) CHECK (ciclo_activo IN (1, 0))
);

-- Tabla Grupo
CREATE TABLE Grupo (
    grupo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    grupo_nombre VARCHAR(50),
    grupo_descripcion TEXT,
    grupo_activo TINYINT(1) CHECK (grupo_activo IN (1, 0)),
    grupo_ciclo_id INT,
    FOREIGN KEY (grupo_ciclo_id) REFERENCES Ciclo_Escolar(ciclo_id)
);

-- Tabla Usuario_Grupo (Asociación entre usuarios y grupos)
CREATE TABLE Usuario_Grupo (
    usuario_grupo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_grupo_usuario_id INT,
    usuario_grupo_grupo_id INT,
    FOREIGN KEY (usuario_grupo_usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (usuario_grupo_grupo_id) REFERENCES Grupo(grupo_id)
);

-- Tabla Criterios
CREATE TABLE Criterios (
    criterio_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    criterio_nombre VARCHAR(100),
    criterio_descripcion TEXT,
    criterio_activo TINYINT(1) CHECK (criterio_activo IN (1, 0))
);

-- Tabla Preguntas
CREATE TABLE Preguntas (
    pregunta_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pregunta_texto VARCHAR(100),
    pregunta_criterio_id INT,
    FOREIGN KEY (pregunta_criterio_id) REFERENCES Criterios(criterio_id)
);

-- Tabla Evaluaciones (almacena una evaluación por grupo para cada profesor)
CREATE TABLE Evaluaciones (
    evaluacion_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    evaluacion_usuario_id INT, -- Profesor evaluado
    evaluacion_grupo_id INT,
    evaluacion_descripcion VARCHAR(50),
    evaluacion_terminada ENUM('NO', 'SI') NOT NULL DEFAULT 'NO',
    FOREIGN KEY (evaluacion_usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (evaluacion_grupo_id) REFERENCES Grupo(grupo_id),
    UNIQUE (evaluacion_usuario_id, evaluacion_grupo_id)
);

-- Tabla Evaluaciones Pendientes
CREATE TABLE Evaluaciones_Pendientes (
    ev_pndt_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ev_pndt_evaluacion_id INT NOT NULL,
    ev_pndt_usuario_id INT NOT NULL, -- Usuario pendiente de contestar
    ev_pndt_contestada ENUM('SI', 'NO'),
    FOREIGN KEY (ev_pndt_evaluacion_id) REFERENCES Evaluaciones(evaluacion_id),
    FOREIGN KEY (ev_pndt_usuario_id) REFERENCES Usuarios(usuario_id)
);

-- Tabla Resultados (detalles de cada respuesta en las evaluaciones)
CREATE TABLE Resultados (
    resultado_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    resultado_puntaje INT, -- Se usa INT para puntajes numéricos
    resultado_evaluacion_id INT,
    resultado_pregunta_id INT,
    resultado_usuario_id INT, -- Usuario que respondió
    FOREIGN KEY (resultado_pregunta_id) REFERENCES Preguntas(pregunta_id),
    FOREIGN KEY (resultado_evaluacion_id) REFERENCES Evaluaciones(evaluacion_id),
    FOREIGN KEY (resultado_usuario_id) REFERENCES Usuarios(usuario_id)
);


-- Inserción inicial de roles
-- Los roles estan definidos siempre de esta forma
INSERT INTO Roles (rol_nombre, rol_descripcion)
VALUES 
    ('Administrador', 'Usuario con acceso total al sistema'), -- 1
    ('Profesor', 'Usuario que imparte clases en grupos específicos'), -- 2
    ('Estudiante', 'Usuario que cursa materias en grupos específicos'); -- 3
    
-- Creamos al administrador que tendra por defecto
INSERT INTO Usuarios (
    usuario_nombres, 
    usuario_clave, 
    usuario_password, 
    usuario_activo, 
    usuario_fecha_alta, 
    usuario_rol_id
) VALUES (
    'Admin por defecto',         -- Reemplaza con el nombre del administrador
    'admin01',           -- Reemplaza con la clave deseada
    'password123',     -- Reemplaza con la contraseña deseada
    1,                    -- Indica que el usuario está activo
    CURDATE(),            -- Fecha de alta actual
    1                     -- Rol de administrador
);

-- -------------------------------------------------------- procedimiento almacenado para Academia ------------------------------------------------------
DELIMITER $$
create procedure academia_select(in pAcademia_id int)
begin
	select 	academia_id,
			academia_nombre,
            academia_descripcion,
            academia_fecha_de_creacion,
            if (academia_activo = 1, 'SI', 'NO') AS academia_activo
            from evaluacion_docente.academia
            where (academia_id = pacademia_id or pacademia_id is null or pacademia_id= '');
end$$
DELIMITER ;


-- **********************************************************************************************************************************  
-- crear un procedimiento almacenado para AGREGAR registros de la tabla "tbAcademias"
delimiter $$
create procedure Academia_insert(
		in pAcademia_nombre varchar(100),
        in pAcademia_descripcion text,
        in pAcademia_fecha_de_creacion date
    )
begin
	insert into evaluacion_docente.academia(
		Academia_nombre, Academia_descripcion,
        Academia_fecha_de_creacion
	) 
    values (
		pAcademia_nombre,
        pAcademia_descripcion,
        pAcademia_fecha_de_creacion
	);
end $$
delimiter ;


-- ******************************************************************************************************************************************
-- crear el procedimiento almacenado para  <<ACTUALIZAR>> registros a la tabla "tbAcademias",
--  apartir del ID recibido 

delimiter $$
create procedure Academia_update  
( 
	in pAcademia_id int,
	in pAcademia_nombre varchar(100),
    in pAcademia_descripcion text,
	in pAcademia_activo int,
    in pAcademia_fecha_de_creacion date
 )
begin
	update evaluacion_docente.Academia set Academia_nombre 			  = pAcademia_nombre,
										   Academia_descripcion 	  = pAcademia_descripcion,
										   Academia_activo 			  = pAcademia_activo,
                                           Academia_fecha_de_creacion = pAcademia_fecha_de_creacion
	where Academia_id = pAcademia_id;
end$$
delimiter ;

-- ----------------------------------------------------------------------------
-- crear procedimientos almacenado para <<ELIMINAR>> Academias a partir de ID recibido
delimiter $$
create procedure Academia_delete(in pAcademia_id int)
begin
	delete from evaluacion_docente.Academia where Academia_id = pAcademia_id;
end$$
delimiter ;



-- ************************ procedimiento almacenado para Departamento Academico *************

DELIMITER $$
CREATE PROCEDURE Departamento_Academico_select(IN pDepartamento_id INT)
BEGIN
    SELECT d.departamento_id,
           d.departamento_nombre,
           d.departamento_descripcion,
           d.departamento_academia_id,
           a.academia_nombre,  -- Campo de la tabla Academia
           d.departamento_fecha_de_creacion,
           IF(d.departamento_activo = 1, 'SI', 'NO') AS departamento_activo
    FROM evaluacion_docente.Departamento_Academico d
    LEFT JOIN evaluacion_docente.Academia a ON d.departamento_academia_id = a.academia_id
    WHERE (d.departamento_id = pDepartamento_id OR pDepartamento_id IS NULL OR pDepartamento_id = '')
    ORDER BY d.departamento_id ASC;
END$$
DELIMITER ;

-- ***********************************************************************************************
-- crear un procedimiento almacenado para AGREGAR registros de la tabla Departamento Academico
delimiter $$
create procedure Departamento_Academico_insert(
	in pDepartamento_nombre varchar(100),
    in pDepartamento_descripcion text,
    in pDepartamento_academia_id int,
    in pDepartamento_fecha_de_creacion date)
begin
	insert into evaluacion_docente.Departamento_Academico(
		Departamento_nombre,
        Departamento_descripcion,
        Departamento_academia_id,
        Departamento_fecha_de_creacion) 
	values (
		pDepartamento_nombre,
        pDepartamento_descripcion,
        pDepartamento_academia_id,
        pDepartamento_fecha_de_creacion
	);
end $$
delimiter ;

-- ******************************************************************************************************************************************
-- crear el procedimiento almacenado para  <<ACTUALIZAR>> registros a la tabla "tbDepartamento_Academicos",
--  apartir del ID recibido 

delimiter $$
create procedure Departamento_Academico_update  
( 
	in pDepartamento_id int,
	in pDepartamento_nombre varchar(100),
    in pDepartamento_descripcion text,
	in pDepartamento_activo int,
    in dDepartamento_academia_id int,
    in pDepartamento_fecha_de_creacion date
 )
begin
	update evaluacion_docente.Departamento_Academico set Departamento_nombre 			  = pDepartamento_nombre,
														 Departamento_descripcion 	      = pDepartamento_descripcion,
														 Departamento_activo 		   	  = pDepartamento_activo,
                                                         Departamento_academia_id         = dDepartamento_academia_id,
														 Departamento_fecha_de_creacion   = pDepartamento_fecha_de_creacion
	where Departamento_id = pDepartamento_id;
end$$
delimiter ;

-- ----------------------------------------------------------------------------
-- crear procedimientos almacenado para <<ELIMINAR>> Departamento_Academicos a partir de ID recibido
delimiter $$
create procedure Departamento_Academico_delete(in pDepartamento_id int)
begin
	delete from evaluacion_docente.Departamento_Academico where Departamento_id = pDepartamento_id;
end$$
delimiter ;

-- =======================================
-- CARRERAS
-- Crear el procedimiento para seleccionar evaluacion_docente.carreras
DELIMITER $$
CREATE PROCEDURE carrera_select(IN pcarrera_id INT)
BEGIN
    SELECT carrera_id,
           carrera_clave,
           carrera_nombre
    FROM evaluacion_docente.carreras
    WHERE (carrera_id = pcarrera_id OR pcarrera_id IS NULL);
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE carrera_insert(
    IN pcarrera_clave VARCHAR(10),
    IN pcarrera_nombre VARCHAR(100)
)
BEGIN
    INSERT INTO evaluacion_docente.carreras (carrera_clave, carrera_nombre) 
    VALUES (pcarrera_clave, pcarrera_nombre);
END$$
DELIMITER ;

-- Crear el procedimiento para actualizar evaluacion_docente.evaluacion_docente.carreras
DELIMITER $$
CREATE PROCEDURE carrera_update(
    IN pcarrera_id INT,
    IN pcarrera_clave VARCHAR(10),
    IN pcarrera_nombre VARCHAR(100)
)
BEGIN
    UPDATE evaluacion_docente.carreras 
    SET carrera_clave = pcarrera_clave,
        carrera_nombre = pcarrera_nombre
    WHERE carrera_id = pcarrera_id;
END$$
DELIMITER ;

-- Actualizar una categoría existente
CALL carrera_update(1, 'IS01', 'Ingeniería de Software');

-- Crear el procedimiento para eliminar evaluacion_docente.evaluacion_docente.carreras
DELIMITER $$
CREATE PROCEDURE carrera_delete(IN pcarrera_id INT)
BEGIN
    DELETE FROM evaluacion_docente.carreras WHERE carrera_id = pcarrera_id;
END$$
DELIMITER ;


-- PROCEDIMIENTOS ADMINISTRADOR
DELIMITER $$

CREATE PROCEDURE Administrador_select(IN pUsuario_id INT)
BEGIN
    SELECT usuario_id,
           usuario_nombres AS Administrador_nombre,
           usuario_clave AS Administrador_clave,
           usuario_password AS Administrador_password,
           IF(usuario_activo = 1, 'SI', 'NO') AS Administrador_activo
    FROM Usuarios
    WHERE usuario_rol_id = 1 
      AND (usuario_id = pUsuario_id OR pUsuario_id IS NULL OR pUsuario_id = '');
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE Administrador_insert(
    IN pUsuario_nombres VARCHAR(100), 
    IN pUsuario_clave VARCHAR(10), 
    IN pUsuario_password VARCHAR(20)
)
BEGIN
    INSERT INTO Usuarios (usuario_nombres, usuario_clave, usuario_password, usuario_activo, usuario_fecha_alta, usuario_rol_id)
    VALUES (pUsuario_nombres, pUsuario_clave, pUsuario_password, 1, CURDATE(), 1);
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE Administrador_update(
    IN pUsuario_id INT,
    IN pUsuario_nombres VARCHAR(100),
    IN pUsuario_clave VARCHAR(10),
    IN pUsuario_activo INT,
    IN pUsuario_password VARCHAR(20)
)
BEGIN
    UPDATE Usuarios
    SET usuario_nombres = pUsuario_nombres,
        usuario_clave = pUsuario_clave,
        usuario_activo = pUsuario_activo,
        usuario_password = pUsuario_password
    WHERE usuario_id = pUsuario_id AND usuario_rol_id = 1;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE Administrador_delete(IN pUsuario_id INT)
BEGIN
    DELETE FROM Usuarios 
    WHERE usuario_id = pUsuario_id AND usuario_rol_id = 1;
END$$

DELIMITER ;


-- PROCEDMIENTOS ESTUDIANTE

DELIMITER $$

CREATE PROCEDURE estudiante_select(IN pUsuario_id INT)
BEGIN
    SELECT 
        u.usuario_id AS estudiante_id,
        u.usuario_nombres AS estudiante_nombres,
        u.usuario_clave AS estudiante_clave,
        u.usuario_password AS estudiante_password,
        u.usuario_apellido_materno AS estudiante_apellido_materno,
        u.usuario_apellido_paterno AS estudiante_apellido_paterno,
        u.usuario_fecha_nacimiento AS estudiante_fecha_nacimiento,
        u.usuario_genero AS estudiante_genero,
        IF(u.usuario_activo = 1, 'SI', 'NO') AS estudiante_activo,
        u.usuario_fecha_alta AS estudiante_fecha_alta,
        u.usuario_fecha_baja AS estudiante_fecha_baja,
        u.usuario_carrera_id AS estudiante_carrera_id,
        c.carrera_nombre AS estudiante_carrera
    FROM 
        Usuarios u
    LEFT JOIN 
        Carreras c ON u.usuario_carrera_id = c.carrera_id
    WHERE 
        u.usuario_rol_id = 3 
        AND (u.usuario_id = pUsuario_id OR pUsuario_id IS NULL OR pUsuario_id = '');
END$$

DELIMITER ;

call estudiante_select(null);

DELIMITER $$

CREATE PROCEDURE estudiante_select_clave(IN pUsuario_clave VARCHAR(10))
BEGIN
    SELECT 
        u.usuario_id AS estudiante_id,
        u.usuario_nombres AS estudiante_nombres,
        u.usuario_clave AS estudiante_clave,
        u.usuario_password AS estudiante_password,
        u.usuario_apellido_materno AS estudiante_apellido_materno,
        u.usuario_apellido_paterno AS estudiante_apellido_paterno,
        u.usuario_fecha_nacimiento AS estudiante_fecha_nacimiento,
        u.usuario_genero AS estudiante_genero,
        IF(u.usuario_activo = 1, 'SI', 'NO') AS estudiante_activo,
        u.usuario_fecha_alta AS estudiante_fecha_alta,
        u.usuario_fecha_baja AS estudiante_fecha_baja,
        u.usuario_carrera_id AS estudiante_carrera_id,
        c.carrera_nombre AS estudiante_carrera
    FROM 
        Usuarios u
    LEFT JOIN 
        Carreras c ON u.usuario_carrera_id = c.carrera_id
    WHERE usuario_rol_id = 3 
      AND (usuario_clave = pUsuario_clave OR pUsuario_clave IS NULL OR pUsuario_clave = '');
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE estudiante_insert(
    IN pUsuario_nombres VARCHAR(100),
    IN pUsuario_clave VARCHAR(10),
    IN pUsuario_password VARCHAR(20),
    IN pUsuario_apellido_materno VARCHAR(50),
    IN pUsuario_apellido_paterno VARCHAR(50),
    IN pUsuario_fecha_nacimiento DATE,
    IN pUsuario_genero ENUM('M', 'F', 'O'),
    IN pUsuario_activo TINYINT(1),
    IN pUsuario_fecha_alta DATE,
    IN pUsuario_fecha_baja DATE,
    IN pUsuario_carrera_id INT
)
BEGIN
    INSERT INTO Usuarios (
        usuario_nombres,
        usuario_clave,
        usuario_password,
        usuario_apellido_materno,
        usuario_apellido_paterno,
        usuario_fecha_nacimiento,
        usuario_genero,
        usuario_activo,
        usuario_fecha_alta,
        usuario_fecha_baja,
        usuario_carrera_id,
        usuario_rol_id
    )
    VALUES (
        pUsuario_nombres,
        pUsuario_clave,
        pUsuario_password,
        pUsuario_apellido_materno,
        pUsuario_apellido_paterno,
        pUsuario_fecha_nacimiento,
        pUsuario_genero,
        pUsuario_activo,
        pUsuario_fecha_alta,
        pUsuario_fecha_baja,
        pUsuario_carrera_id,
        3 -- Rol de estudiante
    );
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE estudiante_update(
    IN pUsuario_id INT,
    IN pUsuario_nombres VARCHAR(100),
    IN pUsuario_clave VARCHAR(10),
    IN pUsuario_password VARCHAR(20),
    IN pUsuario_apellido_materno VARCHAR(50),
    IN pUsuario_apellido_paterno VARCHAR(50),
    IN pUsuario_fecha_nacimiento DATE,
    IN pUsuario_genero ENUM('M', 'F', 'O'),
    IN pUsuario_activo TINYINT(1),
    IN pUsuario_fecha_alta DATE,
    IN pUsuario_fecha_baja DATE,
    IN pUsuario_carrera_id INT
)
BEGIN
    UPDATE Usuarios
    SET usuario_nombres = pUsuario_nombres,
        usuario_clave = pUsuario_clave,
        usuario_password = pUsuario_password,
        usuario_apellido_materno = pUsuario_apellido_materno,
        usuario_apellido_paterno = pUsuario_apellido_paterno,
        usuario_fecha_nacimiento = pUsuario_fecha_nacimiento,
        usuario_genero = pUsuario_genero,
        usuario_activo = pUsuario_activo,
        usuario_fecha_alta = pUsuario_fecha_alta,
        usuario_fecha_baja = pUsuario_fecha_baja,
        usuario_carrera_id = pUsuario_carrera_id
    WHERE usuario_id = pUsuario_id AND usuario_rol_id = 3;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE estudiante_delete(IN pUsuario_id INT)
BEGIN
    DELETE FROM Usuarios 
    WHERE usuario_id = pUsuario_id AND usuario_rol_id = 3;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE ObtenerEstudiantesPaginados(
    IN pagina INT,
    IN registros_por_pagina INT
)
BEGIN
    -- Declaración de la variable offset
    DECLARE offset INT;

    -- Validación para asegurar que los parámetros de entrada son correctos
    IF pagina < 1 THEN
        SET pagina = 1;
    END IF;

    IF registros_por_pagina < 1 THEN
        SET registros_por_pagina = 10; -- Valor por defecto si no se especifica uno válido
    END IF;

    -- Cálculo del desplazamiento para la paginación
    SET offset = (pagina - 1) * registros_por_pagina;

    -- Selección de registros con límite y desplazamiento para paginación
    SELECT 
        u.usuario_id AS estudiante_id,
        u.usuario_nombres AS estudiante_nombres,
        u.usuario_clave AS estudiante_clave,
        u.usuario_password AS estudiante_password,
        u.usuario_apellido_materno AS estudiante_apellido_materno,
        u.usuario_apellido_paterno AS estudiante_apellido_paterno,
        u.usuario_fecha_nacimiento AS estudiante_fecha_nacimiento,
        u.usuario_genero AS estudiante_genero,
        IF(u.usuario_activo = 1, 'SI', 'NO') AS estudiante_activo,
        u.usuario_fecha_alta AS estudiante_fecha_alta,
        u.usuario_fecha_baja AS estudiante_fecha_baja,
        u.usuario_carrera_id AS estudiante_carrera_id,
        c.carrera_nombre AS estudiante_carrera
    FROM 
        Usuarios u
    LEFT JOIN 
        Carreras c ON u.usuario_carrera_id = c.carrera_id
    WHERE 
        usuario_rol_id = 3 -- Filtrar solo estudiantes
    LIMIT registros_por_pagina OFFSET offset;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE BuscarEstudiantesPaginados(
    IN pagina INT,
    IN registros_por_pagina INT,
    IN busqueda VARCHAR(255)
)
BEGIN
    -- Declaración de la variable offset
    DECLARE offset INT;

    -- Validación para asegurar que los parámetros de entrada son correctos
    IF pagina < 1 THEN
        SET pagina = 1;
    END IF;

    IF registros_por_pagina < 1 THEN
        SET registros_por_pagina = 10; -- Valor por defecto si no se especifica uno válido
    END IF;

    -- Cálculo del desplazamiento para la paginación
    SET offset = (pagina - 1) * registros_por_pagina;

    -- Construcción de la consulta para búsqueda con paginación
    SELECT 
        u.usuario_id AS estudiante_id,
        u.usuario_nombres AS estudiante_nombres,
        u.usuario_clave AS estudiante_clave,
        u.usuario_password AS estudiante_password,
        u.usuario_apellido_materno AS estudiante_apellido_materno,
        u.usuario_apellido_paterno AS estudiante_apellido_paterno,
        u.usuario_fecha_nacimiento AS estudiante_fecha_nacimiento,
        u.usuario_genero AS estudiante_genero,
        IF(u.usuario_activo = 1, 'SI', 'NO') AS estudiante_activo,
        u.usuario_fecha_alta AS estudiante_fecha_alta,
        u.usuario_fecha_baja AS estudiante_fecha_baja,
        u.usuario_carrera_id AS estudiante_carrera_id,
        c.carrera_nombre AS estudiante_carrera
    FROM 
        Usuarios u
    LEFT JOIN 
        Carreras c ON u.usuario_carrera_id = c.carrera_id
    WHERE 
        u.usuario_rol_id = 3 -- Filtrar solo estudiantes
        AND (
            u.usuario_nombres LIKE CONCAT('%', busqueda, '%') OR
            u.usuario_apellido_paterno LIKE CONCAT('%', busqueda, '%') OR
            u.usuario_apellido_materno LIKE CONCAT('%', busqueda, '%') OR
            u.usuario_clave LIKE CONCAT('%', busqueda, '%')
        )
    LIMIT registros_por_pagina OFFSET offset;
END$$

DELIMITER ;


-- PROCEDIMIENTOS PROFESORES

DELIMITER $$

CREATE PROCEDURE profesor_select(IN pUsuario_id INT)
BEGIN
    SELECT 
        u.usuario_id AS profesor_id,
        u.usuario_nombres AS profesor_nombres,
        u.usuario_clave AS profesor_clave,
        u.usuario_password AS profesor_password,
        u.usuario_apellido_materno AS profesor_apellido_materno,
        u.usuario_apellido_paterno AS profesor_apellido_paterno,
        u.usuario_fecha_nacimiento AS profesor_fecha_nacimiento,
        u.usuario_genero AS profesor_genero,
        IF(u.usuario_activo = 1, 'SI', 'NO') AS profesor_activo,
        u.usuario_fecha_alta AS profesor_fecha_alta,
        u.usuario_fecha_baja AS profesor_fecha_baja,
        u.usuario_academia_id AS profesor_academia_id,
        a.academia_nombre AS academia_nombre, -- Nombre de la academia
        u.usuario_departamento_id AS profesor_departamento_id,
        d.departamento_nombre AS departamento_nombre -- Nombre del departamento académico
    FROM 
        Usuarios u
    LEFT JOIN 
        Academia a ON u.usuario_academia_id = a.academia_id
    LEFT JOIN 
        Departamento_Academico d ON u.usuario_departamento_id = d.departamento_id
    WHERE 
        u.usuario_rol_id = 2
        AND (u.usuario_id = pUsuario_id OR pUsuario_id IS NULL OR pUsuario_id = '');
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE BuscarProfesoresPaginados(
    IN pagina INT,
    IN registros_por_pagina INT,
    IN busqueda VARCHAR(255)
)
BEGIN
    -- Declaración de la variable offset
    DECLARE offset INT;

    -- Validación para asegurar que los parámetros de entrada son correctos
    IF pagina < 1 THEN
        SET pagina = 1;
    END IF;

    IF registros_por_pagina < 1 THEN
        SET registros_por_pagina = 10; -- Valor por defecto si no se especifica uno válido
    END IF;

    -- Cálculo del desplazamiento para la paginación
    SET offset = (pagina - 1) * registros_por_pagina;

    -- Manejo del caso en que la búsqueda sea nula o vacía
    IF busqueda IS NULL OR busqueda = '' THEN
        SET busqueda = '%'; -- Buscar todo si no se especifica búsqueda
    ELSE
        SET busqueda = CONCAT('%', busqueda, '%'); -- Construir patrón de búsqueda
    END IF;

    -- Construcción de la consulta para búsqueda con paginación
    SELECT 
        u.usuario_id AS profesor_id,
        u.usuario_nombres AS profesor_nombres,
        u.usuario_clave AS profesor_clave,
        u.usuario_password AS profesor_password,
        u.usuario_apellido_materno AS profesor_apellido_materno,
        u.usuario_apellido_paterno AS profesor_apellido_paterno,
        u.usuario_fecha_nacimiento AS profesor_fecha_nacimiento,
        u.usuario_genero AS profesor_genero,
        IF(u.usuario_activo = 1, 'SI', 'NO') AS profesor_activo,
        u.usuario_fecha_alta AS profesor_fecha_alta,
        u.usuario_fecha_baja AS profesor_fecha_baja,
        u.usuario_academia_id AS profesor_academia_id,
        a.academia_nombre AS academia_nombre, -- Nombre de la academia
        u.usuario_departamento_id AS profesor_departamento_id,
        d.departamento_nombre AS departamento_nombre -- Nombre del departamento académico
    FROM 
        Usuarios u
    LEFT JOIN 
        Academia a ON u.usuario_academia_id = a.academia_id
    LEFT JOIN 
        Departamento_Academico d ON u.usuario_departamento_id = d.departamento_id
    WHERE 
        u.usuario_rol_id = 2 -- Filtrar solo profesores
        AND (
            u.usuario_nombres LIKE busqueda OR
            u.usuario_apellido_paterno LIKE busqueda OR
            u.usuario_apellido_materno LIKE busqueda OR
            u.usuario_clave LIKE busqueda
        )
    LIMIT registros_por_pagina OFFSET offset;
END$$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE profesor_select_clave(IN pUsuario_clave INT)
BEGIN
    SELECT usuario_id AS profesor_id,
           usuario_nombres AS profesor_nombres,
           usuario_clave AS profesor_clave,
           usuario_password AS profesor_password,
           usuario_apellido_materno AS profesor_apellido_materno,
           usuario_apellido_paterno AS profesor_apellido_paterno,
           usuario_fecha_nacimiento AS profesor_fecha_nacimiento,
           usuario_genero AS profesor_genero,
           IF(usuario_activo = 1, 'SI', 'NO') AS profesor_activo,
           usuario_fecha_alta AS profesor_fecha_alta,
           usuario_fecha_baja AS profesor_fecha_baja,
           usuario_academia_id AS profesor_academia_id,
           usuario_departamento_id AS profesor_departamento_id
    FROM Usuarios
    WHERE usuario_rol_id = 2
      AND (usuario_clave = pUsuario_clave OR pUsuario_clave IS NULL OR pUsuario_clave = '');
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE profesor_insert(
    IN pUsuario_nombres VARCHAR(100),
    IN pUsuario_clave VARCHAR(10),
    IN pUsuario_password VARCHAR(20),
    IN pUsuario_apellido_materno VARCHAR(50),
    IN pUsuario_apellido_paterno VARCHAR(50),
    IN pUsuario_fecha_nacimiento DATE,
    IN pUsuario_genero ENUM('M', 'F', 'O'),
    IN pUsuario_activo TINYINT(1),
    IN pUsuario_fecha_alta DATE,
    IN pUsuario_fecha_baja DATE,
    IN pUsuario_academia_id INT,
    IN pUsuario_departamento_id INT
)
BEGIN
    INSERT INTO Usuarios (
        usuario_nombres,
        usuario_clave,
        usuario_password,
        usuario_apellido_materno,
        usuario_apellido_paterno,
        usuario_fecha_nacimiento,
        usuario_genero,
        usuario_activo,
        usuario_fecha_alta,
        usuario_fecha_baja,
        usuario_academia_id,
        usuario_departamento_id,
        usuario_rol_id
    )
    VALUES (
        pUsuario_nombres,
        pUsuario_clave,
        pUsuario_password,
        pUsuario_apellido_materno,
        pUsuario_apellido_paterno,
        pUsuario_fecha_nacimiento,
        pUsuario_genero,
        pUsuario_activo,
        pUsuario_fecha_alta,
        pUsuario_fecha_baja,
        pUsuario_academia_id,
        pUsuario_departamento_id,
        2 -- Rol de profesor
    );
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE profesor_update(
    IN pUsuario_id INT,
    IN pUsuario_nombres VARCHAR(100),
    IN pUsuario_clave VARCHAR(10),
    IN pUsuario_password VARCHAR(20),
    IN pUsuario_apellido_materno VARCHAR(50),
    IN pUsuario_apellido_paterno VARCHAR(50),
    IN pUsuario_fecha_nacimiento DATE,
    IN pUsuario_genero ENUM('M', 'F', 'O'),
    IN pUsuario_activo TINYINT(1),
    IN pUsuario_fecha_alta DATE,
    IN pUsuario_fecha_baja DATE,
    IN pUsuario_academia_id INT,
    IN pUsuario_departamento_id INT
)
BEGIN
    UPDATE Usuarios
    SET usuario_nombres = pUsuario_nombres,
        usuario_clave = pUsuario_clave,
        usuario_password = pUsuario_password,
        usuario_apellido_materno = pUsuario_apellido_materno,
        usuario_apellido_paterno = pUsuario_apellido_paterno,
        usuario_fecha_nacimiento = pUsuario_fecha_nacimiento,
        usuario_genero = pUsuario_genero,
        usuario_activo = pUsuario_activo,
        usuario_fecha_alta = pUsuario_fecha_alta,
        usuario_fecha_baja = pUsuario_fecha_baja,
        usuario_academia_id = pUsuario_academia_id,
        usuario_departamento_id = pUsuario_departamento_id
    WHERE usuario_id = pUsuario_id AND usuario_rol_id = 2;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE profesor_delete(IN pUsuario_id INT)
BEGIN
    DELETE FROM Usuarios
    WHERE usuario_id = pUsuario_id AND usuario_rol_id = 2;
END$$

DELIMITER ;


-- Procedimiento almacenado para seleccionar registros de la tabla Ciclo_Escolar
DELIMITER $$
CREATE PROCEDURE ciclo_select(IN pCiclo_id INT)
BEGIN
	SELECT ciclo_id,
		   ciclo_nombre,
		   ciclo_inicio,
		   ciclo_final,
		   IF(ciclo_activo = 1, 'SI', 'NO') AS ciclo_activo
	FROM evaluacion_docente.Ciclo_Escolar
	WHERE (ciclo_id = pCiclo_id OR pCiclo_id IS NULL OR pCiclo_id = '');
END$$
DELIMITER ;


-- Procedimiento almacenado para insertar registros en la tabla Ciclo_Escolar
DELIMITER $$
CREATE PROCEDURE ciclo_insert(
	IN pCiclo_nombre VARCHAR(50),
	IN pCiclo_inicio DATE,
	IN pCiclo_final DATE,
	IN pCiclo_activo TINYINT(1)
)
BEGIN
	INSERT INTO evaluacion_docente.Ciclo_Escolar(
		ciclo_nombre,
		ciclo_inicio,
		ciclo_final,
		ciclo_activo
	)
	VALUES (
		pCiclo_nombre,
		pCiclo_inicio,
		pCiclo_final,
		pCiclo_activo
	);
END$$
DELIMITER ;

-- Procedimiento almacenado para actualizar registros en la tabla Ciclo_Escolar
DELIMITER $$
CREATE PROCEDURE ciclo_update(
	IN pCiclo_id INT,
	IN pCiclo_nombre VARCHAR(50),
	IN pCiclo_inicio DATE,
	IN pCiclo_final DATE,
	IN pCiclo_activo TINYINT(1)
)
BEGIN
	UPDATE evaluacion_docente.Ciclo_Escolar
	SET ciclo_nombre = pCiclo_nombre,
		ciclo_inicio = pCiclo_inicio,
		ciclo_final = pCiclo_final,
		ciclo_activo = pCiclo_activo
	WHERE ciclo_id = pCiclo_id;
END$$
DELIMITER ;


-- Procedimiento almacenado para eliminar registros en la tabla Ciclo_Escolar
DELIMITER $$
CREATE PROCEDURE ciclo_delete(IN pCiclo_id INT)
BEGIN
	DELETE FROM evaluacion_docente.Ciclo_Escolar
	WHERE ciclo_id = pCiclo_id;
END$$
DELIMITER ;


-- =====================================
-- =====================================
-- =====================================
-- =====================================

-- Procedimiento almacenado para seleccionar registros de la tabla Grupo
DELIMITER $$

CREATE PROCEDURE grupo_select(IN pGrupo_id INT)
BEGIN
    SELECT 
        g.grupo_id,
        g.grupo_nombre,
        g.grupo_descripcion,
        IF(g.grupo_activo = 1, 'SI', 'NO') AS grupo_activo,
        g.grupo_ciclo_id,
        c.ciclo_nombre AS ciclo_nombre
    FROM 
        evaluacion_docente.Grupo g
    LEFT JOIN 
        evaluacion_docente.Ciclo_Escolar c 
        ON g.grupo_ciclo_id = c.ciclo_id
    WHERE 
        (g.grupo_id = pGrupo_id OR pGrupo_id IS NULL OR pGrupo_id = '');
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE grupos_por_ciclo(IN pCiclo_id INT)
BEGIN
    SELECT 
        g.grupo_id,
        g.grupo_nombre,
        g.grupo_descripcion,
        IF(g.grupo_activo = 1, 'SI', 'NO') AS grupo_activo,
        g.grupo_ciclo_id,
        c.ciclo_nombre AS ciclo_nombre
    FROM 
        evaluacion_docente.Grupo g
    LEFT JOIN 
        evaluacion_docente.Ciclo_Escolar c 
        ON g.grupo_ciclo_id = c.ciclo_id
    WHERE 
        (g.grupo_ciclo_id = pCiclo_id OR pCiclo_id IS NULL OR pCiclo_id = '');
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE BuscarGruposPaginados(
    IN pagina INT,
    IN registros_por_pagina INT,
    IN busqueda_nombre VARCHAR(255),
    IN ciclo_id INT
)
BEGIN
    -- Declaración de la variable offset
    DECLARE offset INT;

    -- Validación para asegurar que los parámetros de entrada son correctos
    IF pagina < 1 THEN
        SET pagina = 1;
    END IF;

    IF registros_por_pagina < 1 THEN
        SET registros_por_pagina = 10; -- Valor por defecto si no se especifica uno válido
    END IF;

    -- Cálculo del desplazamiento para la paginación
    SET offset = (pagina - 1) * registros_por_pagina;

    -- Manejo del caso en que la búsqueda sea nula o vacía
    IF busqueda_nombre IS NULL OR busqueda_nombre = '' THEN
        SET busqueda_nombre = '%'; -- Buscar todo si no se especifica búsqueda
    ELSE
        SET busqueda_nombre = CONCAT('%', busqueda_nombre, '%'); -- Construir patrón de búsqueda
    END IF;

    -- Construcción de la consulta para búsqueda con paginación
    SELECT 
        g.grupo_id,
        g.grupo_nombre,
        g.grupo_descripcion,
        IF(g.grupo_activo = 1, 'SI', 'NO') AS grupo_activo,
        g.grupo_ciclo_id,
        c.ciclo_nombre AS ciclo_nombre
    FROM 
        evaluacion_docente.Grupo g
    LEFT JOIN 
        evaluacion_docente.Ciclo_Escolar c ON g.grupo_ciclo_id = c.ciclo_id
    WHERE 
        (g.grupo_nombre LIKE busqueda_nombre) AND
        (g.grupo_ciclo_id = ciclo_id OR ciclo_id IS NULL)
    LIMIT registros_por_pagina OFFSET offset;

END$$

DELIMITER ;

-- Procedimiento almacenado para insertar registros en la tabla Grupo
DELIMITER $$
CREATE PROCEDURE grupo_insert(
	IN pGrupo_nombre VARCHAR(50),
	IN pGrupo_descripcion TEXT,
	IN pGrupo_activo TINYINT(1),
	IN pGrupo_ciclo_id INT
)
BEGIN
	INSERT INTO evaluacion_docente.Grupo(
		grupo_nombre,
		grupo_descripcion,
		grupo_activo,
		grupo_ciclo_id
	)
	VALUES (
		pGrupo_nombre,
		pGrupo_descripcion,
		pGrupo_activo,
		pGrupo_ciclo_id
	);
END$$
DELIMITER ;

-- Procedimiento almacenado para actualizar registros en la tabla Grupo
DELIMITER $$
CREATE PROCEDURE grupo_update(
	IN pGrupo_id INT,
	IN pGrupo_nombre VARCHAR(50),
	IN pGrupo_descripcion TEXT,
	IN pGrupo_activo TINYINT(1),
	IN pGrupo_ciclo_id INT
)
BEGIN
	UPDATE evaluacion_docente.Grupo
	SET grupo_nombre = pGrupo_nombre,
		grupo_descripcion = pGrupo_descripcion,
		grupo_activo = pGrupo_activo,
		grupo_ciclo_id = pGrupo_ciclo_id
	WHERE grupo_id = pGrupo_id;
END$$
DELIMITER ;


-- Procedimiento almacenado para eliminar registros en la tabla Grupo
DELIMITER $$
CREATE PROCEDURE grupo_delete(IN pGrupo_id INT)
BEGIN
	DELETE FROM evaluacion_docente.Grupo
	WHERE grupo_id = pGrupo_id;
END$$
DELIMITER ;

-- ========================
-- ========================
-- ========================
-- ========================

-- Procedimiento almacenado para seleccionar registros de la tabla Usuario_Grupo
DELIMITER $$

CREATE PROCEDURE usuario_grupo_select(IN pUsuario_Grupo_id INT)
BEGIN
    SELECT 
        ug.usuario_grupo_id,
        ug.usuario_grupo_usuario_id,
        u.usuario_nombres AS usuario_nombre,
        ug.usuario_grupo_grupo_id,
        g.grupo_nombre AS grupo_nombre
    FROM 
        evaluacion_docente.Usuario_Grupo ug
    LEFT JOIN 
        evaluacion_docente.Usuarios u 
        ON ug.usuario_grupo_usuario_id = u.usuario_id
    LEFT JOIN 
        evaluacion_docente.Grupo g 
        ON ug.usuario_grupo_grupo_id = g.grupo_id
    WHERE 
        (ug.usuario_grupo_id = pUsuario_Grupo_id OR pUsuario_Grupo_id IS NULL OR pUsuario_Grupo_id = '');
END$$

DELIMITER ;

-- Invocar el procedimiento "usuario_grupo_select"
CALL usuario_grupo_select(7);   -- Para mostrar solo el registro con id = 1
CALL usuario_grupo_select(NULL); -- Para mostrar todos los registros

-- Procedimiento almacenado para insertar registros en la tabla Usuario_Grupo
DELIMITER $$
CREATE PROCEDURE usuario_grupo_insert(
    IN pUsuario_grupo_usuario_id INT,
    IN pUsuario_grupo_grupo_id INT
)
BEGIN
    INSERT INTO evaluacion_docente.Usuario_Grupo(
        usuario_grupo_usuario_id,
        usuario_grupo_grupo_id
    )
    VALUES (
        pUsuario_grupo_usuario_id,
        pUsuario_grupo_grupo_id
    );
END$$
DELIMITER ;

call profesor_select(null);

-- Procedimiento almacenado para actualizar registros en la tabla Usuario_Grupo
DELIMITER $$
CREATE PROCEDURE usuario_grupo_update(
    IN pUsuario_Grupo_id INT,
    IN pUsuario_grupo_usuario_id INT,
    IN pUsuario_grupo_grupo_id INT
)
BEGIN
    UPDATE evaluacion_docente.Usuario_Grupo
    SET usuario_grupo_usuario_id = pUsuario_grupo_usuario_id,
        usuario_grupo_grupo_id = pUsuario_grupo_grupo_id
    WHERE usuario_grupo_id = pUsuario_Grupo_id;
END$$
DELIMITER ;

-- Procedimiento almacenado para eliminar registros en la tabla Usuario_Grupo
DELIMITER $$
CREATE PROCEDURE usuario_grupo_delete(IN pUsuario_Grupo_id INT)
BEGIN
    DELETE FROM evaluacion_docente.Usuario_Grupo
    WHERE usuario_grupo_id = pUsuario_Grupo_id;
END$$
DELIMITER ;

-- Procedimiento para obtener grupos por usuario y rol

DELIMITER $$

CREATE PROCEDURE obtener_usuarios_por_rol_y_grupo(
    IN pRol_id INT,
    IN pGrupo_id INT
)
BEGIN
    SELECT 
        u.usuario_id, -- Se incluye el ID del usuario en el resultado
        ug.usuario_grupo_id,
        u.usuario_clave,
        u.usuario_nombres,
        u.usuario_apellido_paterno,
        u.usuario_apellido_materno,
        r.rol_nombre,
        r.rol_descripcion,
        g.grupo_nombre,
        g.grupo_descripcion
    FROM 
        Usuario_Grupo ug
    INNER JOIN 
        Usuarios u ON ug.usuario_grupo_usuario_id = u.usuario_id
    INNER JOIN 
        Roles r ON u.usuario_rol_id = r.rol_id
    INNER JOIN 
        Grupo g ON ug.usuario_grupo_grupo_id = g.grupo_id
    WHERE 
        (r.rol_id = pRol_id OR pRol_id IS NULL OR pRol_id = '')
        AND (g.grupo_id = pGrupo_id OR pGrupo_id IS NULL OR pGrupo_id = '');
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE obtener_usuario_por_rol_y_id(
    IN pRol_id INT,
    IN pUsuario_id INT
)
BEGIN
    SELECT 
        u.usuario_id,
        u.usuario_clave,
        u.usuario_nombres,
        u.usuario_apellido_paterno,
        u.usuario_apellido_materno,
        r.rol_nombre,
        r.rol_descripcion,
        g.grupo_id,
        g.grupo_nombre,
        g.grupo_descripcion
    FROM 
        Usuario_Grupo ug
    INNER JOIN 
        Usuarios u ON ug.usuario_grupo_usuario_id = u.usuario_id
    INNER JOIN 
        Roles r ON u.usuario_rol_id = r.rol_id
    INNER JOIN 
        Grupo g ON ug.usuario_grupo_grupo_id = g.grupo_id
    WHERE 
        (r.rol_id = pRol_id OR pRol_id IS NULL OR pRol_id = '')
        AND (u.usuario_id = pUsuario_id OR pUsuario_id IS NULL OR pUsuario_id = '');
END$$

DELIMITER ;

-- ===================================
-- ===================================
-- ===================================
-- PROCEDIMIENTOS EVALUACIONES
-- ===================================
-- ===================================
-- ===================================

DELIMITER $$

CREATE PROCEDURE Evaluaciones_select(IN pEvaluacion_id INT)
BEGIN
    SELECT 
        e.evaluacion_id,
        e.evaluacion_descripcion,
        e.evaluacion_terminada,
        g.grupo_id, -- ID del grupo
        g.grupo_nombre,
        g.grupo_descripcion,
        u.usuario_id, -- ID del usuario
        u.usuario_nombres,
        u.usuario_apellido_paterno,
        u.usuario_apellido_materno
    FROM 
        Evaluaciones e
    JOIN 
        Grupo g ON e.evaluacion_grupo_id = g.grupo_id
    JOIN 
        Usuarios u ON e.evaluacion_usuario_id = u.usuario_id
    WHERE 
        (e.evaluacion_id = pEvaluacion_id OR pEvaluacion_id IS NULL OR pEvaluacion_id = '');
END$$

DELIMITER ;

call Evaluaciones_select(null);

DELIMITER $$

CREATE PROCEDURE EvaluacionesFiltro_select(
    IN pPagina INT, 
    IN pRegistrosPorPagina INT, 
    IN pBusquedaDescripcion VARCHAR(255), 
    IN pEvaluacionTerminada ENUM('SI', 'NO'),
    IN pCicloEscolar INT
)
BEGIN
    -- Declaración de la variable offset
    DECLARE offset INT;

    -- Validaciones para paginación
    IF pPagina < 1 THEN
        SET pPagina = 1;
    END IF;

    IF pRegistrosPorPagina < 1 THEN
        SET pRegistrosPorPagina = 10; -- Valor por defecto si no se especifica
    END IF;

    -- Cálculo del offset
    SET offset = (pPagina - 1) * pRegistrosPorPagina;

    -- Manejo del patrón de búsqueda
    IF pBusquedaDescripcion IS NULL OR pBusquedaDescripcion = '' THEN
        SET pBusquedaDescripcion = '%'; -- Buscar todo si no hay criterio de búsqueda
    ELSE
        SET pBusquedaDescripcion = CONCAT('%', pBusquedaDescripcion, '%'); -- Construir patrón de búsqueda
    END IF;

    -- Consulta con paginación, búsqueda y filtros
    SELECT 
        e.evaluacion_id,
        e.evaluacion_descripcion,
        IF(e.evaluacion_terminada = 'SI', 'SI', 'NO') AS evaluacion_terminada,
        g.grupo_id, 
        g.grupo_nombre,
        g.grupo_descripcion,
        u.usuario_id, 
        u.usuario_nombres,
        u.usuario_apellido_paterno,
        u.usuario_apellido_materno,
        c.ciclo_id,
        c.ciclo_nombre
    FROM 
        Evaluaciones e
    JOIN 
        Grupo g ON e.evaluacion_grupo_id = g.grupo_id
    JOIN 
        Usuarios u ON e.evaluacion_usuario_id = u.usuario_id
    LEFT JOIN 
        Ciclo_Escolar c ON g.grupo_ciclo_id = c.ciclo_id
    WHERE 
        (e.evaluacion_descripcion LIKE pBusquedaDescripcion) AND
        (e.evaluacion_terminada = pEvaluacionTerminada OR pEvaluacionTerminada IS NULL) AND
        (c.ciclo_id = pCicloEscolar OR pCicloEscolar IS NULL)
    LIMIT pRegistrosPorPagina OFFSET offset;

END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE EvaluacionesPorCiclo_select(
    IN pCicloEscolar INT
)
BEGIN
    -- Validación del ciclo escolar
    IF pCicloEscolar IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ciclo escolar es obligatorio.';
    END IF;

    -- Consulta para obtener todas las evaluaciones del ciclo escolar
    SELECT 
        e.evaluacion_id,
        e.evaluacion_descripcion,
        IF(e.evaluacion_terminada = 'SI', 'SI', 'NO') AS evaluacion_terminada,
        g.grupo_id, 
        g.grupo_nombre,
        g.grupo_descripcion,
        u.usuario_id, 
        u.usuario_nombres,
        u.usuario_apellido_paterno,
        u.usuario_apellido_materno,
        c.ciclo_id,
        c.ciclo_nombre
    FROM 
        Evaluaciones e
    JOIN 
        Grupo g ON e.evaluacion_grupo_id = g.grupo_id
    JOIN 
        Usuarios u ON e.evaluacion_usuario_id = u.usuario_id
    LEFT JOIN 
        Ciclo_Escolar c ON g.grupo_ciclo_id = c.ciclo_id
    WHERE 
        c.ciclo_id = pCicloEscolar;

END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE Evaluaciones_por_ciclo(IN pCiclo_id INT)
BEGIN
    SELECT 
        e.evaluacion_id,
        e.evaluacion_descripcion,
        g.grupo_id, -- ID del grupo
        g.grupo_nombre,
        g.grupo_descripcion,
        u.usuario_id, -- ID del usuario
        u.usuario_nombres,
        u.usuario_apellido_paterno,
        u.usuario_apellido_materno,
        c.ciclo_id,
        c.ciclo_nombre,
        c.ciclo_inicio,
        c.ciclo_final
    FROM 
        Evaluaciones e
    JOIN 
        Grupo g ON e.evaluacion_grupo_id = g.grupo_id
    JOIN 
        Usuarios u ON e.evaluacion_usuario_id = u.usuario_id
    JOIN 
        Ciclo_Escolar c ON g.grupo_ciclo_id = c.ciclo_id
    WHERE 
        (c.ciclo_id = pCiclo_id OR pCiclo_id IS NULL OR pCiclo_id = '');
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE Evaluaciones_insert(
    IN pEvaluacion_usuario_id INT,
    IN pEvaluacion_grupo_id INT,
    IN pEvaluacion_descripcion VARCHAR(50)
)
BEGIN
    INSERT INTO Evaluaciones (
        evaluacion_usuario_id,
        evaluacion_grupo_id,
        evaluacion_descripcion
    ) 
    VALUES (
        pEvaluacion_usuario_id,
        pEvaluacion_grupo_id,
        pEvaluacion_descripcion
    );
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE Evaluaciones_update(
    IN pEvaluacion_id INT,
    IN pEvaluacion_usuario_id INT,
    IN pEvaluacion_grupo_id INT,
    IN pEvaluacion_descripcion VARCHAR(50)
)
BEGIN
    UPDATE Evaluaciones
    SET 
        evaluacion_usuario_id = pEvaluacion_usuario_id,
        evaluacion_grupo_id = pEvaluacion_grupo_id,
        evaluacion_descripcion = pEvaluacion_descripcion
    WHERE 
        evaluacion_id = pEvaluacion_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE terminarEvaluacion (
    IN p_evaluacion_id INT
)
BEGIN
    UPDATE Evaluaciones
    SET evaluacion_terminada = 'SI'
    WHERE evaluacion_id = p_evaluacion_id;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE Evaluaciones_delete(IN pEvaluacion_id INT)
BEGIN
    DELETE FROM Evaluaciones
    WHERE evaluacion_id = pEvaluacion_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE Evaluaciones_con_grupo_y_usuario(
    IN pGrupo_id INT
)
BEGIN
    SELECT 
        e.evaluacion_id,
        e.evaluacion_descripcion,
        g.grupo_nombre,
        g.grupo_descripcion,
        u.usuario_nombres,
        u.usuario_apellido_paterno,
        u.usuario_apellido_materno
    FROM 
        Evaluaciones e
    JOIN 
        Grupo g ON e.evaluacion_grupo_id = g.grupo_id
    JOIN 
        Usuarios u ON e.evaluacion_usuario_id = u.usuario_id
    WHERE 
        (e.evaluacion_grupo_id = pGrupo_id OR pGrupo_id IS NULL OR pGrupo_id = '');
END$$

DELIMITER ;


-- ===================================
-- ===================================
-- ===================================
-- PROCEDIMIENTOS EVALUACIONES PENDIENTES
-- ===================================
-- ===================================
-- ===================================



DELIMITER $$

CREATE PROCEDURE EvaluacionesPendientes_select(IN pUsuario_id INT)
BEGIN
    SELECT 
        ep.ev_pndt_id,
        ep.ev_pndt_usuario_id,
        ep.ev_pndt_contestada,
        e.evaluacion_id,
        e.evaluacion_usuario_id,
        e.evaluacion_grupo_id,
        e.evaluacion_descripcion,
        e.evaluacion_terminada,
        g.grupo_nombre
    FROM 
        Evaluaciones_Pendientes ep
    JOIN 
        Evaluaciones e
    ON 
        ep.ev_pndt_evaluacion_id = e.evaluacion_id
    JOIN 
        Grupo g
    ON 
        e.evaluacion_grupo_id = g.grupo_id
    WHERE 
        (ep.ev_pndt_usuario_id = pUsuario_id OR pUsuario_id IS NULL OR pUsuario_id = '');
END$$

DELIMITER ;

use evaluacion_docente;

call EvaluacionesPendientes_select(null);

DELIMITER $$

CREATE PROCEDURE EvaluacionesPendientes_insert(
    IN pEv_pndt_evaluacion_id INT,
    IN pEv_pndt_usuario_id INT,
    IN pEv_pndt_contestada ENUM('SI', 'NO')
)
BEGIN
    INSERT INTO Evaluaciones_Pendientes (
        ev_pndt_evaluacion_id,
        ev_pndt_usuario_id,
        ev_pndt_contestada
    ) 
    VALUES (
        pEv_pndt_evaluacion_id,
        pEv_pndt_usuario_id,
        pEv_pndt_contestada
    );
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE EvaluacionesPendientes_update(
    IN pEv_pndt_id INT,
    IN pEv_pndt_contestada ENUM('SI', 'NO')
)
BEGIN
    UPDATE Evaluaciones_Pendientes
    SET 
        ev_pndt_contestada = pEv_pndt_contestada
    WHERE 
        ev_pndt_id = pEv_pndt_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE EvaluacionesPendientes_delete(IN pEv_pndt_id INT)
BEGIN
    DELETE FROM Evaluaciones_Pendientes
    WHERE ev_pndt_id = pEv_pndt_id;
END$$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE Criterios_select(IN pCriterio_id INT)
BEGIN
    SELECT criterio_id,
           criterio_nombre,
           criterio_descripcion,
           IF(criterio_activo = 1, 'SI', 'NO') AS criterio_activo
    FROM Criterios
    WHERE (criterio_id = pCriterio_id OR pCriterio_id IS NULL);
END$$
DELIMITER ;

DELIMITER $$ 
CREATE PROCEDURE Criterios_select_by_name(IN pCriterio_nombre VARCHAR(100))
BEGIN
    SELECT criterio_id,
           criterio_nombre,
           criterio_descripcion,
           IF(criterio_activo = 1, 'SI', 'NO') AS criterio_activo
    FROM Criterios
    WHERE (criterio_nombre LIKE CONCAT('%', pCriterio_nombre, '%') OR pCriterio_nombre IS NULL);
END$$
DELIMITER ;


DELIMITER $$ 
CREATE PROCEDURE Criterios_insert(
    IN pCriterio_nombre VARCHAR(100),
    IN pCriterio_descripcion TEXT,
    IN pCriterio_activo TINYINT(1)
)
BEGIN
    INSERT INTO Criterios (criterio_nombre, criterio_descripcion, criterio_activo)
    VALUES (pCriterio_nombre, pCriterio_descripcion, pCriterio_activo);
END$$
DELIMITER ;

DELIMITER $$ 
CREATE PROCEDURE Criterios_update(
    IN pCriterio_id INT,
    IN pCriterio_nombre VARCHAR(100),
    IN pCriterio_descripcion TEXT,
    IN pCriterio_activo TINYINT(1)
)
BEGIN
    UPDATE Criterios
    SET criterio_nombre = pCriterio_nombre,
        criterio_descripcion = pCriterio_descripcion,
        criterio_activo = pCriterio_activo
    WHERE criterio_id = pCriterio_id;
END$$
DELIMITER ;

DELIMITER $$ 
CREATE PROCEDURE Criterios_delete(IN pCriterio_id INT)
BEGIN
    DELETE FROM Criterios WHERE criterio_id = pCriterio_id;
END$$
DELIMITER ;

DELIMITER $$ 
CREATE PROCEDURE Preguntas_select(
    IN pPregunta_id INT
)
BEGIN
    SELECT p.pregunta_id,
           p.pregunta_texto,
           c.criterio_id,
           c.criterio_nombre,
           c.criterio_descripcion
    FROM Preguntas p
    JOIN Criterios c ON p.pregunta_criterio_id = c.criterio_id
    WHERE (p.pregunta_id = pPregunta_id OR pPregunta_id IS NULL)
    ORDER BY c.criterio_id, p.pregunta_id;
END$$
DELIMITER ;

DELIMITER $$ 
CREATE PROCEDURE PreguntasPorCriterio_select(
    IN pCriterio_id INT
)
BEGIN
    SELECT 
        p.pregunta_id,
        p.pregunta_texto,
        c.criterio_id,
        c.criterio_nombre,
        c.criterio_descripcion
    FROM 
        Preguntas p
    JOIN 
        Criterios c 
    ON 
        p.pregunta_criterio_id = c.criterio_id
    WHERE 
        (c.criterio_id = pCriterio_id OR pCriterio_id IS NULL)
    ORDER BY 
        c.criterio_id, p.pregunta_id;
END$$
DELIMITER ;


DELIMITER $$

CREATE PROCEDURE Preguntas_select_paginado(
    IN pPregunta_id INT,
    IN pagina INT,
    IN registros_por_pagina INT
)
BEGIN
    -- Declaración de la variable offset
    DECLARE offset INT;

    -- Validación para asegurar que los parámetros de entrada son correctos
    IF pagina < 1 THEN
        SET pagina = 1;
    END IF;

    IF registros_por_pagina < 1 THEN
        SET registros_por_pagina = 10; -- Valor por defecto si no se especifica uno válido
    END IF;

    -- Cálculo del desplazamiento para la paginación
    SET offset = (pagina - 1) * registros_por_pagina;

    -- Construcción de la consulta para preguntas con paginación
    SELECT p.pregunta_id,
           p.pregunta_texto,
           c.criterio_id,
           c.criterio_nombre,
           c.criterio_descripcion
    FROM Preguntas p
    JOIN Criterios c ON p.pregunta_criterio_id = c.criterio_id
    WHERE (p.pregunta_id = pPregunta_id OR pPregunta_id IS NULL)
    ORDER BY c.criterio_id, p.pregunta_id
    LIMIT registros_por_pagina OFFSET offset;
END$$

DELIMITER ;


DELIMITER $$ 
CREATE PROCEDURE Preguntas_select_by_criterio(
    IN pCriterio_id INT
)
BEGIN
    SELECT p.pregunta_id,
           p.pregunta_texto,
           c.criterio_id,
           c.criterio_nombre,
           c.criterio_descripcion
    FROM Preguntas p
    JOIN Criterios c ON p.pregunta_criterio_id = c.criterio_id
    WHERE (p.pregunta_criterio_id = pCriterio_id OR pCriterio_id IS NULL);
END$$
DELIMITER ;

DELIMITER $$ 
CREATE PROCEDURE Preguntas_insert(
    IN pPregunta_texto VARCHAR(100),
    IN pPregunta_criterio_id INT
)
BEGIN
    INSERT INTO Preguntas (pregunta_texto, pregunta_criterio_id)
    VALUES (pPregunta_texto, pPregunta_criterio_id);
END$$
DELIMITER ;

DELIMITER $$ 
CREATE PROCEDURE Preguntas_update(
    IN pPregunta_id INT,
    IN pPregunta_texto VARCHAR(100),
    IN pPregunta_criterio_id INT
)
BEGIN
    UPDATE Preguntas
    SET pregunta_texto = pPregunta_texto,
        pregunta_criterio_id = pPregunta_criterio_id
    WHERE pregunta_id = pPregunta_id;
END$$
DELIMITER ;

DELIMITER $$ 
CREATE PROCEDURE Preguntas_delete(IN pPregunta_id INT)
BEGIN
    DELETE FROM Preguntas WHERE pregunta_id = pPregunta_id;
END$$
DELIMITER ;

-- =====================================
-- =====================================
-- =====================================

DELIMITER $$

CREATE PROCEDURE Resultados_select(IN pResultado_id INT)
BEGIN
    SELECT 
        r.resultado_id,
        r.resultado_puntaje,
        r.resultado_evaluacion_id,
        r.resultado_pregunta_id,
        r.resultado_usuario_id
    FROM 
        evaluacion_docente.Resultados r
    WHERE 
        (r.resultado_id = pResultado_id OR pResultado_id IS NULL OR pResultado_id = '');
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE Resultados_insert(
    IN pResultado_puntaje INT,
    IN pResultado_evaluacion_id INT,
    IN pResultado_pregunta_id INT,
    IN pResultado_usuario_id INT
)
BEGIN
    INSERT INTO evaluacion_docente.Resultados (
        resultado_puntaje,
        resultado_evaluacion_id,
        resultado_pregunta_id,
        resultado_usuario_id
    )
    VALUES (
        pResultado_puntaje,
        pResultado_evaluacion_id,
        pResultado_pregunta_id,
        pResultado_usuario_id
    );
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE Resultados_delete(IN pResultado_id INT)
BEGIN
    DELETE FROM evaluacion_docente.Resultados
    WHERE resultado_id = pResultado_id;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE getResultadosUsuario(
    IN pUsuarioEvaluadorId INT, -- ID del estudiante que realizó la evaluación
    IN pMaestroEvaluadoId INT, -- ID del maestro evaluado
    IN pCriterioId INT         -- ID del criterio a evaluar
)
BEGIN
    SELECT 
        p.pregunta_criterio_id AS criterio_id,
        c.criterio_nombre,
        AVG(r.resultado_puntaje) AS puntaje_promedio,
        u.usuario_nombres,
        u.usuario_apellido_paterno,
        u.usuario_apellido_materno,
        u.usuario_clave
    FROM 
        evaluacion_docente.Resultados r
    INNER JOIN 
        evaluacion_docente.Preguntas p ON r.resultado_pregunta_id = p.pregunta_id
    INNER JOIN 
        evaluacion_docente.Criterios c ON p.pregunta_criterio_id = c.criterio_id
    INNER JOIN 
        evaluacion_docente.Usuarios u ON r.resultado_usuario_id = u.usuario_id
    WHERE 
        r.resultado_usuario_id = pUsuarioEvaluadorId AND
        r.resultado_evaluacion_id IN (
            SELECT evaluacion_id 
            FROM evaluacion_docente.Evaluaciones 
            WHERE evaluacion_usuario_id = pMaestroEvaluadoId
        ) AND
        p.pregunta_criterio_id = pCriterioId
    GROUP BY 
        p.pregunta_criterio_id, c.criterio_nombre, 
        u.usuario_nombres, u.usuario_apellido_paterno, u.usuario_apellido_materno, u.usuario_clave;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE getResultadosGenerales(
    IN pMaestroEvaluadoId INT, -- ID del maestro evaluado
    IN pCriterioId INT         -- ID del criterio a evaluar
)
BEGIN
    SELECT 
        p.pregunta_criterio_id AS criterio_id,
        c.criterio_nombre,
        AVG(r.resultado_puntaje) AS puntaje_promedio_general
    FROM 
        evaluacion_docente.Resultados r
    INNER JOIN 
        evaluacion_docente.Preguntas p ON r.resultado_pregunta_id = p.pregunta_id
    INNER JOIN 
        evaluacion_docente.Criterios c ON p.pregunta_criterio_id = c.criterio_id
    WHERE 
        r.resultado_evaluacion_id IN (
            SELECT evaluacion_id 
            FROM evaluacion_docente.Evaluaciones 
            WHERE evaluacion_usuario_id = pMaestroEvaluadoId
        ) AND
        p.pregunta_criterio_id = pCriterioId
    GROUP BY 
        p.pregunta_criterio_id, c.criterio_nombre;
END$$

DELIMITER ;


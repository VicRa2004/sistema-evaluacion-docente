import db from "../config/db.js";

const queryGrupoEstudiante = `
SELECT 
    g.grupo_id AS grupo_id,
    g.grupo_nombre AS grupo_nombre,
    g.grupo_descripcion AS grupo_descripcion,
    ce.ciclo_nombre AS ciclo_escolar_nombre,
    p.usuario_id AS profesor_id,
    CONCAT(p.usuario_nombres, ' ', p.usuario_apellido_paterno, ' ', p.usuario_apellido_materno) AS profesor_nombre
FROM 
    Usuario_Grupo ug
INNER JOIN 
    Grupo g ON ug.usuario_grupo_grupo_id = g.grupo_id
INNER JOIN 
    Ciclo_Escolar ce ON g.grupo_ciclo_id = ce.ciclo_id
LEFT JOIN 
    Usuario_Grupo ugp ON ugp.usuario_grupo_grupo_id = g.grupo_id
LEFT JOIN 
    Usuarios p ON ugp.usuario_grupo_usuario_id = p.usuario_id AND p.usuario_rol_id = 2
WHERE 
    ug.usuario_grupo_usuario_id = ? -- ID del estudiante
    AND g.grupo_activo = 1 -- Solo grupos activos
    AND EXISTS (
        SELECT 1
        FROM Usuarios u
        WHERE u.usuario_id = ug.usuario_grupo_usuario_id AND u.usuario_rol_id = 3 -- Asegura que sea un estudiante
    )
    AND NOT EXISTS (
        SELECT 1
        FROM Usuarios u2
        WHERE u2.usuario_id = ugp.usuario_grupo_usuario_id AND u2.usuario_rol_id = 3 -- Evita duplicados de estudiantes
    );

`;

const queryGrupoProfesor = `
SELECT 
    g.grupo_id AS grupo_id,
    g.grupo_nombre AS grupo_nombre,
    g.grupo_descripcion AS grupo_descripcion,
    ce.ciclo_nombre AS ciclo_escolar_nombre,
    p.usuario_id AS profesor_id,
    CONCAT(p.usuario_nombres, ' ', p.usuario_apellido_paterno, ' ', p.usuario_apellido_materno) AS profesor_nombre
FROM 
    Usuario_Grupo ug
INNER JOIN 
    Grupo g ON ug.usuario_grupo_grupo_id = g.grupo_id
INNER JOIN 
    Ciclo_Escolar ce ON g.grupo_ciclo_id = ce.ciclo_id
INNER JOIN 
    Usuarios p ON ug.usuario_grupo_usuario_id = p.usuario_id AND p.usuario_rol_id = 2 -- Solo profesores
WHERE 
    ug.usuario_grupo_usuario_id = ? -- ID del profesor
    AND g.grupo_activo = 1 -- Solo grupos activos
    AND EXISTS (
        SELECT 1
        FROM Usuarios u
        WHERE u.usuario_id = ug.usuario_grupo_usuario_id AND u.usuario_rol_id = 2 -- Asegura que sea un profesor
    );
`;

const mGrupo = {
    /**
     * Inserta un nuevo grupo en la base de datos.
     * @param {Object} grupo - Objeto con los datos del grupo.
     * @param {string} grupo.nombre - Nombre del grupo.
     * @param {string} grupo.descripcion - Descripción del grupo.
     * @param {boolean} grupo.activo - Estado activo del grupo (1 o 0).
     * @param {number} grupo.ciclo_id - ID del ciclo escolar asociado.
     * @returns {Promise<Object>} Resultado de la operación.
     */
    create: async (grupo) => {
        try {
            const [results] = await db.query("call grupo_insert(?, ?, ?, ?);", [
                grupo.nombre,
                grupo.descripcion,
                grupo.activo,
                grupo.ciclo_id,
            ]);
            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al crear el grupo ${grupo.nombre}`,
            };
        }
    },

    /**
     * Obtiene todos los grupos de la base de datos.
     * @returns {Promise<Array>} Lista de grupos.
     */
    get: async () => {
        try {
            const [results] = await db.query("call grupo_select(null);");
            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: "Error al cargar los grupos",
            };
        }
    },

    /**
     * Obtiene un grupo específico por su ID.
     * @param {number} id - ID del grupo a buscar.
     * @returns {Promise<Object>} Datos del grupo encontrado.
     */
    getOne: async (id) => {
        try {
            const [results] = await db.query("call grupo_select(?);", [id]);
            return results[0][0];
        } catch (err) {
            console.log(err);
            throw {
                status: 404,
                message: "El grupo no existe",
            };
        }
    },

    /**
     * Actualiza un grupo en la base de datos.
     * @param {Object} grupo - Objeto con los datos del grupo a actualizar.
     * @param {number} grupo.id - ID del grupo.
     * @param {string} grupo.nombre - Nuevo nombre del grupo.
     * @param {string} grupo.descripcion - Nueva descripción del grupo.
     * @param {boolean} grupo.activo - Nuevo estado activo del grupo (1 o 0).
     * @param {number} grupo.ciclo_id - Nuevo ID del ciclo asociado.
     * @returns {Promise<Object>} Resultado de la operación.
     */
    update: async (grupo) => {
        try {
            const [results] = await db.query(
                "call grupo_update(?, ?, ?, ?, ?);",
                [
                    grupo.id,
                    grupo.nombre,
                    grupo.descripcion,
                    grupo.activo,
                    grupo.ciclo_id,
                ]
            );
            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al actualizar el grupo ${grupo.nombre}`,
            };
        }
    },

    /**
     * Elimina un grupo de la base de datos.
     * @param {number} id - ID del grupo a eliminar.
     * @returns {Promise<Object>} Resultado de la operación.
     */
    delete: async (id) => {
        try {
            const [results] = await db.query("call grupo_delete(?);", [id]);
            return results[0];
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: "Error al eliminar el grupo",
            };
        }
    },
    getGruposEstudiantes: async (id) => {
        try {
            const [results] = await db.query(queryGrupoEstudiante, [id]);

            console.log(results);

            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: "Error al encontrar los grupos del estudiante",
            };
        }
    },
    getGruposProfesor: async (id) => {
        try {
            const [results] = await db.query(queryGrupoProfesor, [id]);

            console.log(results);

            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: "Error al encontrar los grupos del profesor",
            };
        }
    },
    getBusqueda: async (page, query = "", cicloId = null) => {
        try {
            const [results] = await db.query(
                "CALL BuscarGruposPaginados(?, 9, ?, ?);",
                [page, query, cicloId]
            );

            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: `Error al cargar los Grupos`,
            };
        }
    },

    getGruposCicloId: async (id) => {
        try {
            const [results] = await db.query("CALL grupos_por_ciclo(?);", [id]);
            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: "Error al encontrar los grupos del profesor",
            };
        }
    },
};

export default mGrupo;

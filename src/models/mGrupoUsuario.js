import db from "../config/db.js";

const mGrupoUsuario = {
    /**
     * Obtiene un grupo específico con el profesor y los estudiantes.
     * @param id ID del grupo.
     * @returns {
     *    profesor: Object,
     *    estudiantes: Array
     * } Datos del grupo.
     */
    getOne: async (id) => {
        try {
            // OBTENEMOS LOS ESTUDIANTES
            const [results] = await db.query(
                "CALL obtener_usuarios_por_rol_y_grupo(3, ?);",
                [id]
            );

            // OBTENEMOS EL PROFESOR
            const [results2] = await db.query(
                "CALL obtener_usuarios_por_rol_y_grupo(2, ?);",
                [id]
            );

            // OBTENEMOS SI FORMA PARTE DE UNA EVALUACION

            const [results3] = await db.query(
                "call Evaluaciones_con_grupo_y_usuario(?);",
                [id]
            );

            let evaluacion = null;

            let profesor = null;

            if (results3[0].length === 0) {
                //console.log("No hay evaluacion");
            } else {
                evaluacion = results3[0][0];
            }

            if (results2[0][0]) {
                profesor = {
                    nombre: results2[0][0].usuario_nombres,
                    apellidos: `${results2[0][0].usuario_apellido_materno} ${results2[0][0].usuario_apellido_paterno}`,
                    clave: results2[0][0].usuario_clave,
                    id: results2[0][0].usuario_id,
                    grupo_id: results2[0][0].usuario_grupo_id,
                };
            }

            return {
                profesor,
                estudiantes: results[0],
                evaluacion,
            };
        } catch (err) {
            throw {
                status: 500,
                message: "Error al cargar los grupos de estudiante",
            };
        }
    },

    userExists: async (usuarioId, grupoId) => {
        try {
            const [response] = await db.query(
                "CALL obtener_usuario_por_rol_y_id(3, ?);",
                [usuarioId]
            );

            const user = response[0][0];
            const users = response[0];

            console.log(users);

            if (users.length > 0) {
                const exists = users.some((user) => user.grupo_id == grupoId);
                if (exists) {
                    return true;
                }
            }

            if (!user) {
                return false;
            }

            if (user.grupo_id == grupoId) {
                return true;
            }

            return false;
        } catch (err) {
            throw {
                status: 500,
                message: "Error al añadir usuario al grupo.",
            };
        }
    },

    /**
     * Añade un estudiante a un grupo.
     * @param usuarioId ID del estudiante.
     * @param grupoId ID del grupo.
     */
    addUser: async (usuarioId, grupoId) => {
        try {
            await db.query("CALL usuario_grupo_insert(?, ?);", [
                usuarioId,
                grupoId,
            ]);
            return { message: "Usuario añadido al grupo correctamente." };
        } catch (err) {
            throw {
                status: 500,
                message: "Error al añadir usuario al grupo.",
            };
        }
    },

    /**
     * Elimina un estudiante de un grupo.
     * @param usuarioGrupoId ID de la relación entre el estudiante y el grupo.
     */
    removeUser: async (usuarioGrupoId) => {
        try {
            console.log(usuarioGrupoId);
            const resp = await db.query("CALL usuario_grupo_delete(?);", [
                usuarioGrupoId,
            ]);
            return resp;
        } catch (err) {
            throw {
                status: 500,
                message: "Error al eliminar usuario del grupo.",
            };
        }
    },
};

export default mGrupoUsuario;

import db from "../config/db.js";

const mEvaluacion = {
    create: async (evaluacion) => {
        try {
            console.log(evaluacion);
            const [results] = await db.query(
                "call Evaluaciones_insert(?, ?, ?);",
                [
                    evaluacion.usuario_id, // ID DEL PROFESOR
                    evaluacion.grupo_id,
                    evaluacion.descripcion,
                ]
            );
            return results;
        } catch (err) {
            throw {
                status: 500,
                message: `Error al crear la evaluación`,
            };
        }
    },
    get: async () => {
        try {
            const [results] = await db.query("call Evaluaciones_select(null);");
            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: `Error al cargar los datos`,
            };
        }
    },
    getOne: async (id) => {
        try {
            const [results] = await db.query("call Evaluaciones_select(?)", [
                id,
            ]);
            return results[0][0];
        } catch (err) {
            console.log(err);
            throw {
                status: 404,
                message: `Error el Administrador no existe no existe`,
            };
        }
    },

    getGrupoId: async (grupoId) => {
        try {
            const [results] = await db.query(
                "call Evaluaciones_con_grupo_y_usuario(?)",
                [grupoId]
            );
            return results[0][0];
        } catch (err) {
            console.log(err);
            throw {
                status: 404,
                message: `Error la Evaluacion no existe`,
            };
        }
    },

    getEvaluacionesFiltro: async (data) => {
        try {
            const [results] = await db.query("call EvaluacionesFiltro_select(?, ?, ?, ?, ?);",
                [
                    data.pagina,
                    data.totalPaginas || 10,
                    data.busqueda,
                    data.terminada,
                    data.filtro
                ]
            );
            return results[0];
        } catch (err) {
            console.log(err)
            throw {
                status: 500,
                message: `Error al cargar los datos`,
            };
        }
    },

    getEvaluacionesCiclo: async (id) => {
        try {
            const [results] = await db.query("call Evaluaciones_por_ciclo(?);", [id]);
            return results[0];
        } catch (err) {
            console.log(err)
            throw {
                status: 500,
                message: `Error al cargar los datos`,
            };
        }
    },

    update: async (evaluacion) => {
        try {
            const [results] = await db.query(
                "call Evaluaciones_update(?, ?, ?, ?, ?);",
                [
                    evaluacion.id,
                    evaluacion.usuario_id, // ID del profesor
                    evaluacion.grupo_id,
                    evaluacion.descripcion,
                ]
            );
            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al crear la evaluacion`,
            };
        }
    },
    delete: async (id) => {
        try {
            const [results] = await db.query("call Evaluaciones_delete(?);", [
                id,
            ]);
            return results[0];
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al eliminar la evaluacion`,
            };
        }
    },
    // terminarEvaluacion
    terminar: async (id) => {
        try {
            const [results] = await db.query("call terminarEvaluacion(?);", [
                id,
            ]);
            return results[0];
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al eliminar la evaluacion`,
            };
        }
    }

};

export default mEvaluacion;

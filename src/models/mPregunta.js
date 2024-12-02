import db from "../config/db.js";

const mPregunta = {
    // Crear un nuevo ciclo escolar
    create: async (pregunta) => {
        try {
            const [results] = await db.query("CALL Preguntas_insert(?, ?);", [
                pregunta.texto,
                pregunta.criterio_id,
            ]);
            return results;
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al crear el ciclo escolar ${pregunta.nombre}`,
            };
        }
    },

    // Obtener todos los ciclos escolares
    get: async () => {
        try {
            const [results] = await db.query("CALL Preguntas_select(NULL);");
            return results[0];
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: "Error al cargar los datos de las preguntas",
            };
        }
    },

    // Obtener un ciclo escolar específico por ID
    getOne: async (id) => {
        try {
            const [results] = await db.query("call Preguntas_select(?);", [id]);
            return results[0][0];
        } catch (err) {
            console.error(err);
            throw {
                status: 404,
                message: `Error: el criterio con ID ${id} no existe`,
            };
        }
    },

    getForCriterios: async (criterio_id) => {
        try {
            const [results] = await db.query(
                "CALL PreguntasPorCriterio_select(?);",
                [criterio_id]
            );

            return results[0];
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: "Error al cargar los datos de las preguntas",
            };
        }
    },

    getPaginado: async (pagina) => {
        try {
            const [results] = await db.query(
                "CALL Preguntas_select_paginado(NULL, ?, 10);",
                [pagina]
            );
            return results[0];
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: "Error al cargar los datos de las preguntas",
            };
        }
    },

    update: async (pregunta) => {
        try {
            const [results] = await db.query(
                "CALL Preguntas_update(?, ?, ?);",
                [pregunta.id, pregunta.texto, pregunta.criterio_id]
            );
            return results;
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al actualizar el cirterio ${pregunta.nombre}`,
            };
        }
    },

    // Eliminar un ciclo escolar
    delete: async (id) => {
        try {
            const [results] = await db.query("CALL Preguntas_delete(?);", [id]);
            return results;
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al eliminar el criterio con ID ${id}`,
            };
        }
    },
};

export default mPregunta;

import db from "../config/db.js";

const mResultado = {
    // Crear un nuevo resultado
    create: async (resultado) => {
        try {
            console.log(resultado)
            const [results] = await db.query(
                'CALL Resultados_insert(?, ?, ?, ?);',
                [
                    resultado.puntaje,               // Parámetro 1
                    resultado.evaluacion_id,         // Parámetro 2
                    resultado.pregunta_id,           // Parámetro 3
                    resultado.usuario_id             // Parámetro 4
                ]
            );
            return results;
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al registrar el resultado de la pregunta ${resultado.pregunta_id}`
            };
        }
    },

    // Obtener todos los resultados
    get: async () => {
        try {
            const [results] = await db.query("CALL Resultados_select(NULL);");
            return results[0]; // Primer conjunto de resultados
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al cargar los resultados`,
            };
        }
    },

    getResultadosEstudiante: async (data) => {
        try {
            const [results] = await db.query("CALL getResultadosUsuario(?, ?, ?);", [
                data.id_estudiante,
                data.id_profesor,
                data.id_criterio
            ]);
            return results[0][0]; // Primer elemento del primer conjunto de resultados
        } catch (err) {
            console.error(err);
            throw {
                status: 404,
                message: `El resultado con ID ${id} no existe`,
            };
        }
    },

    getResultadosGenerales: async (data) => {
        try {
            const [results] = await db.query("CALL getResultadosGenerales(?, ?);", [
                data.id_profesor,
                data.id_criterio
            ]);
            return results[0][0]; // Primer elemento del primer conjunto de resultados
        } catch (err) {
            console.error(err);
            throw {
                status: 404,
                message: `El resultado con ID ${id} no existe`,
            };
        }
    },

    // Obtener un resultado específico
    getOne: async (id) => {
        try {
            const [results] = await db.query("CALL Resultados_select(?);", [id]);
            return results[0][0]; // Primer elemento del primer conjunto de resultados
        } catch (err) {
            console.error(err);
            throw {
                status: 404,
                message: `El resultado con ID ${id} no existe`,
            };
        }
    },

    // Eliminar un resultado por su ID
    delete: async (id) => {
        try {
            const [results] = await db.query("CALL Resultados_delete(?);", [id]);
            return results[0]; // Retorna el resultado de la operación
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al eliminar el resultado con ID ${id}`,
            };
        }
    },
};

export default mResultado;

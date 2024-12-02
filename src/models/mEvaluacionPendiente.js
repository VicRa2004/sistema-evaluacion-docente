import db from "../config/db.js";

const mEvaluacionPendiente = {
    create: async (evaluacionPendiente) => {
        try {
            const [results] = await db.query(
                "call EvaluacionesPendientes_insert(?, ?, ?);",
                [
                    evaluacionPendiente.evaluacion_id,
                    evaluacionPendiente.usuario_id, // ID del estudiante
                    "NO", // Para indicar que no esta contestada por defecto
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
    get: async (id) => {
        if (!id) {
            id = null;
        }

        try {
            const [results] = await db.query(
                "call EvaluacionesPendientes_select(?);",
                [id]
            );

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
            const [results] = await db.query(
                "call EvaluacionesPendientes_select(?)",
                [id]
            );
            return results[0][0];
        } catch (err) {
            console.log(err);
            throw {
                status: 404,
                message: `La evaluacion no existe`,
            };
        }
    },
    update: async (evaluacionPendiente) => {
        try {
            const [results] = await db.query(
                "call EvaluacionesPendientes_update(?, ?);",
                [
                    evaluacionPendiente.id, // Obtenemos el ID de la evaluacion pendiente
                    evaluacionPendiente.contestada, // Para indicar que no esta contestada por defecto
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
            const [results] = await db.query(
                "call EvaluacionnesPendientes_delete(?);",
                [id]
            );
            return results[0];
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al eliminar la evaluacion`,
            };
        }
    },
};

export default mEvaluacionPendiente;

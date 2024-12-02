import mEvaluacion from "../models/mEvaluacion.js";
import mEvaluacionPendiente from "../models/mEvaluacionPendiente.js";
import mGrupoUsuario from "../models/mGrupoUsuario.js";

const createOneEvaluacion = async ({ descripcion, idProfesor, idGrupo }) => {
    try {
        if (!idGrupo || !idProfesor) {
            return {
                error: "Debes de rellenar todos los datos",
            };
        }

        if (!descripcion) {
            return {
                error: "Debes de rellenar todos los datos",
            };
        }

        const response = await mEvaluacion.create({
            usuario_id: idProfesor,
            grupo_id: idGrupo,
            descripcion,
        });

        // OBTENEMOS LOS ESTUDIANTES DE UN GRUPO PARA OBTENER LAS
        // EVALUACIONES PENDIENTES
        const grupo = await mGrupoUsuario.getOne(idGrupo);
        const evaluacion = await mEvaluacion.getGrupoId(idGrupo);

        grupo.estudiantes.forEach(async (estudiante) => {
            console.log(estudiante.usuario_id);
            console.log(evaluacion.evaluacion_id);

            const resp = await mEvaluacionPendiente.create({
                evaluacion_id: evaluacion.evaluacion_id,
                usuario_id: estudiante.usuario_id,
            });
        });

        return {
            ok: true,
        };
    } catch (err) {
        return {
            error: err,
        };
    }
};

export { createOneEvaluacion };

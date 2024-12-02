import mResultado from '../models/mResultado.js'
import mEvaluacion from '../models/mEvaluacion.js'
import mCriterio from '../models/mCriterio.js'
import mGrupoUsuario from '../models/mGrupoUsuario.js'
import mEstudiante from '../models/mEstudiante.js'

const cResultado = {
    getResultado: async (req, res) => {
        try {
            const id = req.params.id;

            // Obtener evaluación
            const evaluacion = await mEvaluacion.getOne(id);

            // Obtener criterios
            const criterios = await mCriterio.get();

            // Obtener grupo
            const grupo = await mGrupoUsuario.getOne(evaluacion.grupo_id);

            // Procesar resultados por criterio
            const resultadosPorCriterio = await Promise.all(
                criterios.map(async (criterio) => {
                    // Resultados individuales de estudiantes
                    const estudiantes = await Promise.all(
                        grupo.estudiantes.map(async (estudiante) => {
                            const resultadoCriterio = await mResultado.getResultadosEstudiante({
                                id_estudiante: estudiante.usuario_id,
                                id_profesor: evaluacion.usuario_id,
                                id_criterio: criterio.criterio_id,
                            });

                            if (resultadoCriterio == null) {
                                const std = await mEstudiante.getOneId(estudiante.usuario_id);
                                return {
                                    criterio_id: criterio.criterio_id,
                                    criterio_nombre: criterio.criterio_nombre,
                                    puntaje: null,
                                    usuario_nombres: std.estudiante_nombre,
                                    usuario_apellido_paterno: std.estudiante_apellido_paterno,
                                    usuario_apellido_materno: std.estudiante_apellido_materno,
                                    usuario_clave: std.estudiante_clave
                                };
                            }

                            return resultadoCriterio; // Se respeta el formato original
                        })
                    );

                    // Resultados generales del criterio
                    const resultados = await mResultado.getResultadosGenerales({
                        id_profesor: evaluacion.usuario_id,
                        id_criterio: criterio.criterio_id,
                    });

                    return {
                        ...resultados, // Incluye resultados generales
                        estudiantes, // Incluye resultados por estudiante
                    };
                })
            );

            console.log("Datos Resueltos:", JSON.stringify(resultadosPorCriterio, null, 2));

            res.render("admin/evaluaciones/resultados", {
                title: "Admin - Resultados",
                resultadosPorCriterio,
            });
        } catch (err) {
            console.error(err);
            res.status(err.status || 500).send(err.message || "Error interno del servidor");
        }
    }
}

export default cResultado;
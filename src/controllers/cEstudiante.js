import { formatDate } from "../libs/formatDate.js";
import mGrupo from "../models/mGrupo.js";
import mEvaluacionPendiente from "../models/mEvaluacionPendiente.js";
import mCriterio from "../models/mCriterio.js";
import mPregunta from "../models/mPregunta.js";
import { transformarRespuestas } from "../libs/preguntasFormato.js";
import mResultado from '../models/mResultado.js'

const cEstudiante = {
    logout: (req, res) => {
        req.session.destroy();
        res.redirect("/login");
    },
    getIndex: (req, res) => {
        res.render("estudiante/", { title: "Estudiante" });
    },
    getPerfil: (req, res) => {
        const estudiante = { ...req.session.estudiante };

        const estudiante_fecha_alta = formatDate(
            estudiante.estudiante_fecha_alta
        );

        const newEstudiante = {
            ...estudiante,
            estudiante_fecha_alta,
        };

        console.log(estudiante);
        res.render("estudiante/perfil", {
            title: "Estudiante - Perfil",
            estudiante: newEstudiante,
        });
    },
    getGrupos: async (req, res) => {
        const id = req.session.estudiante.usuario_id;

        const grupos = await mGrupo.getGruposEstudiantes(id);

        console.log(id);

        res.render("estudiante/grupos", {
            title: "Estudiante - Grupos",
            grupos,
        });
    },
    getEvaluacionesPendientes: async (req, res) => {
        const id = req.session.estudiante.usuario_id;

        const evaluacionesPendiente = await mEvaluacionPendiente.get(id);

        console.log(evaluacionesPendiente);

        res.render("estudiante/evaluaciones/index", {
            title: "Evaluaciones - Estudiante",
            evaluaciones: evaluacionesPendiente,
        });
    },
    getFormEvaluacion: async (req, res) => {
        try {
            // Obtén los criterios
            const criterios = await mCriterio.get();
            const evaluacion_id = req.params.id
            const evaluacion_pediente_id = req.params.id_pendiente

            console.log(evaluacion_pediente_id);

            // Usa Promise.all para procesar todos los criterios y sus preguntas
            const criterioPreguntas = await Promise.all(
                criterios.map(async (criterio) => {
                    try {
                        // Obtén las preguntas asociadas al criterio
                        const preguntas = await mPregunta.getForCriterios(
                            criterio.criterio_id
                        );

                        // Devuelve el criterio junto con sus preguntas
                        return {
                            ...criterio,
                            preguntas,
                        };
                    } catch (error) {
                        console.error(
                            `Error al obtener preguntas para el criterio ${criterio.criterio_id}:`,
                            error
                        );
                        return {
                            ...criterio,
                            preguntas: [], // Devuelve un array vacío si falla
                        };
                    }
                })
            );

            // Renderiza la vista con los datos completamente resueltos
            res.render("estudiante/evaluaciones/form", {
                evaluacion_id,
                evaluacion_pediente_id,
                title: "Evaluación",
                criterioPreguntas, // Pasa los datos procesados a la vista
            });
        } catch (error) {
            console.error("Error al obtener la evaluación:", error);
            res.status(500).send("Error interno del servidor");
        }
    },

    manejarEvaluacion: async (req, res) => {
        try {
            const evaluacion_id = req.body.evaluacion_id; // ID de la evaluación
            const estudiante_id = req.session.estudiante.usuario_id; // ID del estudiante logueado
            const evaluacion_pediente_id = req.body.evaluacion_pediente_id

            delete req.body.evaluacion_id; // Eliminamos `evaluacion_id` del cuerpo para que no interfiera
            delete req.body.evaluacion_pediente_id;

            console.log(evaluacion_id)
            console.log(evaluacion_pediente_id)

            // Transformar las respuestas en el formato esperado
            const preguntas = transformarRespuestas(req.body); // [{id_pregunta, id_criterio, respuesta}]

            // Mapeo de respuestas a puntajes
            const puntajes = {
                'Muy de acuerdo': 5,
                'De acuerdo': 4,
                'Neutral': 3,
                'En desacuerdo': 2,
                'Muy en desacuerdo': 1
            };

            // Recorremos cada pregunta y almacenamos el resultado
            for (const pregunta of preguntas) {
                const puntaje = puntajes[pregunta.respuesta] || 0; // Asignamos puntaje según la respuesta
                await mResultado.create({
                    puntaje,
                    evaluacion_id,
                    pregunta_id: pregunta.id_pregunta,
                    usuario_id: estudiante_id
                });
            }

            await mEvaluacionPendiente.update({
                id: evaluacion_pediente_id,
                contestada: "SI"
            });

            // Respuesta exitosa
            res.redirect("/estudiante/evaluaciones/")
        } catch (err) {
            console.error(err);
        }

    },
};

export default cEstudiante;

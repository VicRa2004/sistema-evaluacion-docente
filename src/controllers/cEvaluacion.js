import mEvaluacion from "../models/mEvaluacion.js";
import mEvaluacionPendiente from "../models/mEvaluacionPendiente.js";
import mGrupoUsuario from "../models/mGrupoUsuario.js";
import mCriterio from "../models/mCriterio.js";
import mPregunta from "../models/mPregunta.js";
import { createOneEvaluacion } from "../libs/createOneEvaluacion.js";
import mGrupo from "../models/mGrupo.js";
import mCiclo from "../models/mCiclo.js";

const cEvaluacion = {
    getEvaluaciones: async (req, res) => {
        const page = req.query.page || 1;
        const busqueda = req.query.busqueda || "";
        const filtro = req.query.filtro || null;
        const terminada = req.query.terminada || null

        const data = {
            page,
            busqueda,
            filtro,
            terminada
        }

        const evaluaciones = await mEvaluacion.getEvaluacionesFiltro(data);

        const ciclos = await mCiclo.get();

        res.render("admin/evaluaciones/index", {
            title: "Evaluaciones - Admin",
            evaluaciones,
            page,
            busqueda,
            ciclos,
            filtro,
            terminada
        });
    },

    evaluacionesBusquedaYFiltro: async (req, res) => {
        const busqueda = req.body.grupo_busqueda || "";
        const filtro = req.body.ciclo_id || "";
        const page = req.body.page || 1;
        const terminada = req.body.terminada || "";

        res.redirect(
            `/admin/evaluaciones?busqueda=${busqueda}&filtro=${filtro}&page=${page}&terminada=${terminada}`
        );
    },

    getInfoEvaluacion: async (req, res) => {
        const id = req.params.id;

        const evaluacion = await mEvaluacion.getOne(id);
        const grupo = await mGrupoUsuario.getOne(evaluacion.grupo_id);

        res.render("admin//evaluaciones/info", {
            title: "Admin - Evaluacion",
            ...grupo,
        });
    },

    getFormCretateEvaluacion: (req, res) => {
        //console.log(req.query);
        res.render("admin/evaluaciones/new", {
            title: "Crear Evaluacion - Admin",
            error: req.session.error,
            formData: req.query,
        });
    },

    cretateEvaluacion: async (req, res) => {
        const descripcion = req.body.eva_descripcion;
        const idProfesor = req.body.id_profesor;
        const idGrupo = req.body.id_grupo;

        try {
            if (!idGrupo || !idProfesor) {
                res.redirect(`/admin/evaluaciones/`);
                return;
            }

            if (!descripcion) {
                res.redirect(
                    `/admin/evaluaciones/new?id_grupo=${idGrupo}&id_profesor=${idProfesor}`
                );
                return;
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
                const resp = await mEvaluacionPendiente.create({
                    evaluacion_id: evaluacion.evaluacion_id,
                    usuario_id: estudiante.usuario_id,
                });
            });

            res.redirect(`/admin/evaluaciones/`);
        } catch (err) {
            console.log(err);
        }
    },

    getFormCreateEvaluaciones: async (req, res) => {
        const ciclos = await mCiclo.get();

        res.render("admin/evaluaciones/create", {
            title: "Admin - Crear Evaluaciones",
            ciclos,
        });
    },

    createEvaluaciones: async (req, res) => {
        const ciclo_id = req.body.ciclo_id;

        if (!ciclo_id) {
            res.redirect("/admin/evaluaciones/create");
            return;
        }

        const grupos = await mGrupo.getGruposCicloId(ciclo_id);
        const ciclo = await mCiclo.getOne(ciclo_id);

        await grupos.forEach(async (grupo) => {
            const g = await mGrupoUsuario.getOne(grupo.grupo_id);

            if (!g.profesor) {
                return;
            }

            const eva = await mEvaluacion.getGrupoId(grupo.grupo_id);

            if (!eva) {
                const idProfesor = g.profesor.id;
                const idGrupo = grupo.grupo_id;
                const descripcion = `Evaluacion del ciclo ${ciclo.ciclo_nombre}`;

                const data = {
                    idProfesor,
                    idGrupo,
                    descripcion,
                };

                const response = await createOneEvaluacion(data);
            }
        });

        res.redirect("/admin/evaluaciones");
    },

    getFormTerminarEvaluaciones: async (req, res) => {
        const ciclos = await mCiclo.get();

        res.render("admin/evaluaciones/terminar", {
            title: "Admin - Terminar Evaluaciones",
            ciclos,
        });
    },

    terminarEvaluaciones: async (req, res) => {
        const ciclo_id = parseInt(req.body.ciclo_id) || null;

        if (ciclo_id == null) {
            res.redirect("/admin/evaluaciones/terminar")
            return;
        }

        const evaluaciones = await mEvaluacion.getEvaluacionesCiclo(ciclo_id);

        evaluaciones.forEach(async (evaluacion) => {
            await mEvaluacion.terminar(evaluacion.evaluacion_id);
        })

        res.redirect("/admin/evaluaciones/")
    },

    getPreguntasEvaluaciones: async (req, res) => {
        const pagePreguntas = parseInt(req.query.page_pregunta) || 1;

        const criterios = await mCriterio.get();
        const preguntas = await mPregunta.getPaginado(pagePreguntas);

        res.render("admin/evaluaciones/preguntas/index", {
            title: "Admin - Criterios y Preguntas",
            error: null,
            preguntas,
            criterios,
            pagePreguntas,
        });
    },

    getFormCreatePreguntas: (req, res) => {
        res.render("admin/evaluaciones/preguntas/create", {
            title: "Admin - Create criterio",
            error: null,
        });
    },

    createPreguntas: async (req, res) => {
        try {
            const preguntas = [
                req.body.pregunta_1,
                req.body.pregunta_2,
                req.body.pregunta_3,
                req.body.pregunta_4,
                req.body.pregunta_5,
            ];

            const resultCriterio = await mCriterio.create({
                nombre: req.body.criterio_nombre,
                descripcion: req.body.criterio_descripcion,
            });

            const criterio = await mCriterio.getOneName(
                req.body.criterio_nombre
            );

            const id = criterio.criterio_id;

            for (let i = 0; i < 5; i++) {
                await mPregunta.create({
                    texto: preguntas[i],
                    criterio_id: id,
                });
            }

            res.redirect("/admin/evaluaciones/preguntas/");
        } catch (error) {
            console.log(error);
        }
    },

    getFormUpdateCriteriosPreguntas: async (req, res) => {
        const criterio = await mCriterio.getOne(req.params.id);
        const preguntas = await mPregunta.getForCriterios(criterio.criterio_id);

        res.render("admin/evaluaciones/preguntas/update", {
            title: "Admin - Create criterio",
            error: null,
            criterio,
            preguntas,
        });
    },

    updateCriteriosPreguntas: async (req, res) => {
        const data = req.body;

        const criterio = {
            id: data.criterio_id,
            nombre: data.criterio_nombre,
            descripcion: data.criterio_descripcion,
            activo: data.criterio_activo || 0,
        };

        const preguntas = [
            {
                id: data.pregunta_id_1,
                texto: data.pregunta_texto_1,
                criterio_id: data.criterio_id,
            },
            {
                id: data.pregunta_id_2,
                texto: data.pregunta_texto_2,
                criterio_id: data.criterio_id,
            },
            {
                id: data.pregunta_id_3,
                texto: data.pregunta_texto_3,
                criterio_id: data.criterio_id,
            },
            {
                id: data.pregunta_id_4,
                texto: data.pregunta_texto_4,
                criterio_id: data.criterio_id,
            },
            {
                id: data.pregunta_id_5,
                texto: data.pregunta_texto_5,
                criterio_id: data.criterio_id,
            },
        ];

        const response1 = await mCriterio.update(criterio);

        preguntas.forEach(async (pregunta) => {
            const resp = await mPregunta.update(pregunta);
        });

        res.redirect("/admin/evaluaciones/preguntas");
    },

    deleteCriteriosPreguntas: async (req, res) => {
        const criterioId = parseInt(req.params.id);

        const preguntas = await mPregunta.getForCriterios(criterioId);

        const preguntasIds = [
            preguntas[0].pregunta_id,
            preguntas[1].pregunta_id,
            preguntas[2].pregunta_id,
            preguntas[3].pregunta_id,
            preguntas[4].pregunta_id,
        ];

        const res1 = await mCriterio.delete(criterioId);

        preguntasIds.forEach(async (id) => {
            await mPregunta.delete(id);
        });

        res.redirect("/admin/evaluaciones/preguntas");
    },
};

export default cEvaluacion;

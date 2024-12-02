import { Router } from "express";
import cEvaluacion from "../controllers/cEvaluacion.js";
import cResultado from '../controllers/cResultado.js'
import { isAuthenticatedAdmin } from "../middlewares/auth.js";

const router = Router();

router.get(
    "/admin/evaluaciones/",
    isAuthenticatedAdmin,
    cEvaluacion.getEvaluaciones
);

router.post("/admin/evaluaciones", cEvaluacion.evaluacionesBusquedaYFiltro);

router.get(
    "/admin/evaluaciones/resultados/:id",
    isAuthenticatedAdmin,
    cResultado.getResultado
);

router.get(
    "/admin/evaluaciones/info/:id",
    isAuthenticatedAdmin,
    cEvaluacion.getInfoEvaluacion
);

router.get(
    "/admin/evaluaciones/new/",
    isAuthenticatedAdmin,
    cEvaluacion.getFormCretateEvaluacion
);

router.post(
    "/admin/evaluaciones/new",
    isAuthenticatedAdmin,
    cEvaluacion.cretateEvaluacion
);

router.get(
    "/admin/evaluaciones/create/",
    isAuthenticatedAdmin,
    cEvaluacion.getFormCreateEvaluaciones
);

router.post(
    "/admin/evaluaciones/create",
    isAuthenticatedAdmin,
    cEvaluacion.createEvaluaciones
);

router.get(
    "/admin/evaluaciones/terminar/",
    isAuthenticatedAdmin,
    cEvaluacion.getFormTerminarEvaluaciones
);

router.post(
    "/admin/evaluaciones/terminar/",
    isAuthenticatedAdmin,
    cEvaluacion.terminarEvaluaciones
);

router.get(
    "/admin/evaluaciones/preguntas",
    isAuthenticatedAdmin,
    cEvaluacion.getPreguntasEvaluaciones
);

router.get(
    "/admin/evaluaciones/preguntas/create",
    isAuthenticatedAdmin,
    cEvaluacion.getFormCreatePreguntas
);

router.post(
    "/admin/evaluaciones/preguntas/create",
    isAuthenticatedAdmin,
    cEvaluacion.createPreguntas
);

router.get(
    "/admin/evaluaciones/preguntas/update/:id",
    isAuthenticatedAdmin,
    cEvaluacion.getFormUpdateCriteriosPreguntas
);

router.post(
    "/admin/evaluaciones/preguntas/update",
    isAuthenticatedAdmin,
    cEvaluacion.updateCriteriosPreguntas
);

router.get(
    "/admin/evaluaciones/criterios/delete/:id",
    isAuthenticatedAdmin,
    cEvaluacion.deleteCriteriosPreguntas
);

export default router;

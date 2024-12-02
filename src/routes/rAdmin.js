import { Router } from "express";
import cAdmin from "../controllers/cAdmin.js";
import cAcademia from "../controllers/cruds/cAcademia.js";
import cCarrera from "../controllers/cruds/cCarrera.js";
import cDepartamento from "../controllers/cruds/cDepartamento.js";
import cEstudiante from "../controllers/cruds/cEstudiante.js";
import cProfesor from "../controllers/cruds/cProfesor.js";
import cCiclo from "../controllers/cruds/cCiclo.js";
import { isAuthenticatedAdmin } from "../middlewares/auth.js";
import cGrupo from "../controllers/cruds/cGrupo.js";

const router = Router();

// RUTA ADMIN

router.get("/admin/", isAuthenticatedAdmin, cAdmin.index);

router.get("/admin/logout", isAuthenticatedAdmin, cAdmin.logout);

router.get("/admin/perfil", isAuthenticatedAdmin, cAdmin.getPerfil);

router.get("/admin/grupos", cAdmin.getGrupos);

router.post("/admin/grupos/busqueda_y_filtro", cAdmin.gruposBusquedaYFiltro);

router.get("/admin/grupos/:id", cAdmin.getGrupoInfo);

router.get("/admin/grupos/estudiante/:id", cAdmin.getFormAddEstudianteGrupo);

router.get("/admin/set_grupos/add_estudiante/", cAdmin.addEstudianteGrupo);

router.get("/admin/grupos/profesor/:id", cAdmin.getFormAddProfesorGrupo);

router.get("/admin/set_grupos/add_profesor/", cAdmin.addProfesorGrupo);

router.get(
    "/admin/set_grupos/delete_estudiante/",
    cAdmin.removeEstudianteGrupo
);

router.get("/admin/set_grupos/delete_profesor/", cAdmin.removeProfesorGrupo);

// RUTAS ACADEMIA

router.get("/admin/academia", isAuthenticatedAdmin, cAcademia.getAcademia);

router.get(
    "/admin/academia/create",
    isAuthenticatedAdmin,
    cAcademia.getAcademiaCreate
);

router.post(
    "/admin/academia/create",
    isAuthenticatedAdmin,
    cAcademia.academiaCreate
);

router.get(
    "/admin/academia/update/:id",
    isAuthenticatedAdmin,
    cAcademia.getAcademiaUpdate
);

router.post(
    "/admin/academia/update/:id",
    isAuthenticatedAdmin,
    cAcademia.academiaUpdate
);

router.get(
    "/admin/academia/delete/:id",
    isAuthenticatedAdmin,
    cAcademia.academiaDelelte
);

// RUTAS DEPARTAMENTO

router.get(
    "/admin/departamento",
    isAuthenticatedAdmin,
    cDepartamento.getDepartamento
);

router.get(
    "/admin/departamento/create",
    isAuthenticatedAdmin,
    cDepartamento.getDepartamentoCreate
);

router.post(
    "/admin/departamento/create",
    isAuthenticatedAdmin,
    cDepartamento.departamentoCreate
);

router.get(
    "/admin/departamento/update/:id",
    isAuthenticatedAdmin,
    cDepartamento.getDepartamentoUpdate
);

router.post(
    "/admin/departamento/update/:id",
    isAuthenticatedAdmin,
    cDepartamento.departamentoUpdate
);

router.get(
    "/admin/departamento/delete/:id",
    isAuthenticatedAdmin,
    cDepartamento.departamentoDelelte
);

// RUTAS CARRERA

router.get("/admin/carrera", isAuthenticatedAdmin, cCarrera.getCarrera);

router.get(
    "/admin/carrera/create",
    isAuthenticatedAdmin,
    cCarrera.getCarreraCreate
);

router.post(
    "/admin/carrera/create",
    isAuthenticatedAdmin,
    cCarrera.carreraCreate
);

router.get(
    "/admin/carrera/update/:id",
    isAuthenticatedAdmin,
    cCarrera.getCarreraUpdate
);

router.post(
    "/admin/carrera/update/:id",
    isAuthenticatedAdmin,
    cCarrera.carreraUpdate
);

router.get(
    "/admin/carrera/delete/:id",
    isAuthenticatedAdmin,
    cCarrera.carreraDelelte
);

// RUTAS ESTUDIANTES
router.get(
    "/admin/estudiante/",
    isAuthenticatedAdmin,
    cEstudiante.getEstudiantes
);

router.post(
    "/admin/estudiante/",
    isAuthenticatedAdmin,
    cEstudiante.buscarEstudiantes
);

router.get(
    "/admin/estudiante/create",
    isAuthenticatedAdmin,
    cEstudiante.getEstudianteCreate
);

router.post(
    "/admin/estudiante/create",
    isAuthenticatedAdmin,
    cEstudiante.estudianteCreate
);

router.get(
    "/admin/estudiante/update/:id",
    isAuthenticatedAdmin,
    cEstudiante.getEstudianteUpdate
);

router.post(
    "/admin/estudiante/update/:id",
    isAuthenticatedAdmin,
    cEstudiante.estudianteUpdate
);

router.get(
    "/admin/estudiante/delete/:id",
    isAuthenticatedAdmin,
    cEstudiante.estudianteDelelte
);

// RUTAS PROFESORES
router.get("/admin/profesor/", isAuthenticatedAdmin, cProfesor.getProfesores);

router.post(
    "/admin/profesor/",
    isAuthenticatedAdmin,
    cProfesor.buscarProfesores
);

router.get(
    "/admin/profesor/create",
    isAuthenticatedAdmin,
    cProfesor.getProfesorCreate
);

router.post(
    "/admin/profesor/create",
    isAuthenticatedAdmin,
    cProfesor.profesorCreate
);

router.get(
    "/admin/profesor/update/:id",
    isAuthenticatedAdmin,
    cProfesor.getProfesorUpdate
);

router.post(
    "/admin/profesor/update/:id",
    isAuthenticatedAdmin,
    cProfesor.profesorUpdate
);

router.get(
    "/admin/profesor/delete/:id",
    isAuthenticatedAdmin,
    cProfesor.profesorDelete
);

// RUTAS CLICLOS ESCOLORES

router.get("/admin/ciclo/", isAuthenticatedAdmin, cCiclo.getCiclos);

router.get("/admin/ciclo/create", isAuthenticatedAdmin, cCiclo.getCicloCreate);

router.post("/admin/ciclo/create", isAuthenticatedAdmin, cCiclo.cicloCreate);

router.get(
    "/admin/ciclo/update/:id",
    isAuthenticatedAdmin,
    cCiclo.getCicloUpdate
);

router.post(
    "/admin/ciclo/update/:id",
    isAuthenticatedAdmin,
    cCiclo.cicloUpdate
);

router.get("/admin/ciclo/delete/:id", isAuthenticatedAdmin, cCiclo.cicloDelete);

// RUTAS GRUPOS

router.get("/admin/grupo/", isAuthenticatedAdmin, cGrupo.getGrupo);

router.get("/admin/grupo/create", isAuthenticatedAdmin, cGrupo.getGrupoCreate);

router.post("/admin/grupo/create", isAuthenticatedAdmin, cGrupo.grupoCreate);

router.get(
    "/admin/grupo/update/:id",
    isAuthenticatedAdmin,
    cGrupo.getGrupoUpdate
);

router.post(
    "/admin/grupo/update/:id",
    isAuthenticatedAdmin,
    cGrupo.grupoUpdate
);

router.get("/admin/grupo/delete/:id", isAuthenticatedAdmin, cGrupo.grupoDelete);

export default router;

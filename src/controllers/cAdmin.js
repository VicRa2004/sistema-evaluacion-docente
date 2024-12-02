import mGrupo from "../models/mGrupo.js";
import mGrupoUsuario from "../models/mGrupoUsuario.js";
import mEstudiante from "../models/mEstudiante.js";
import mProfesor from "../models/mProfesor.js";
import mCiclo from "../models/mCiclo.js";
import mCarrera from '../models/mCarrera.js';
import mAcademia from '../models/mAcademia.js'
import mDepartamento from '../models/mDepartamento.js'

const cAdmin = {
    getRegisterForm: (req, res) => {
        res.render("admin/register", { title: "Registrarse" });
    },

    register: (req, res) => {
        try {
            console.log(req.body);
            res.redirect("/admin/");
        } catch (err) { }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect("/login");
    },

    index: async (req, res) => {
        const academia = await mAcademia.get();
        const departamento = await mDepartamento.get();
        const ciclo = await mCiclo.get();
        const carrera = await mCarrera.get();

        console.log(academia)

        res.render("admin/", {
            title: "Principal Admin",
            academia,
            departamento,
            ciclo,
            carrera,
        });
    },

    getPerfil: (req, res) => {
        const admin = { ...req.session.admin };

        res.render("admin/perfil_admin", {
            title: "Perfil - Admin",
            admin,
        });
    },

    getGrupos: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const busqueda = req.query.busqueda || "";
        const filtro = req.query.filtro || null;

        const grupos = await mGrupo.getBusqueda(page, busqueda, filtro);
        const ciclos = await mCiclo.get();

        res.render("admin/grupos", {
            title: "Grupos - Admin",
            grupos,
            ciclos,
            busqueda,
            filtro,
            page,
        });
    },

    gruposBusquedaYFiltro: (req, res) => {
        const busqueda = req.body.grupo_busqueda;
        const filtro = req.body.ciclo_id;
        const page = req.body.page || 1;

        res.redirect(
            `/admin/grupos?busqueda=${busqueda}&filtro=${filtro}&page=${page}`
        );
    },

    getGrupoInfo: async (req, res) => {
        const id = parseInt(req.params.id);

        // VALIDAR SI EXISTE UNA EVALUACION PENDIENTE
        // SI EXISTE NO SE PODRA ALIMINAR NINGUN USUARIO O PROFESOR
        // ADEMAS DE NO PODER CREAR OTRO

        const grupos = await mGrupoUsuario.getOne(id);

        res.render("admin/grupos/index", {
            title: `Grupo ${id} - Admin`,
            ...grupos,
            grupo_id: id,
        });
    },

    getFormAddEstudianteGrupo: async (req, res) => {
        const id = parseInt(req.params.id);

        const estudiantes = await mEstudiante.get();

        //const existsGroup = await mGrupoUsuario.userExists(13, id);

        // Usa Promise.all para resolver todas las promesas generadas por map
        const newEstudiantes = await Promise.all(
            estudiantes.map(async (estudiante) => {
                //console.log(estudiante);
                const existsGroup = await mGrupoUsuario.userExists(
                    estudiante.estudiante_id,
                    id
                );
                console.log(existsGroup);

                return {
                    ...estudiante,
                    existsGroup,
                };
            })
        );

        res.render("admin/grupos/add_estudiante", {
            title: `Grupo ${id} Agregar Estudiante - Admin`,
            estudiantes: newEstudiantes,
            grupo_id: id,
            error: req.session.adminError,
        });
    },

    addEstudianteGrupo: async (req, res) => {
        try {
            const idUsuario = parseInt(req.query.id_usuario);
            const idGrupo = parseInt(req.query.id_grupo);

            console.log(idUsuario, idGrupo);

            const estudiante = await mEstudiante.getOneId(idUsuario);

            console.log(estudiante);

            if (!estudiante) {
                req.session.adminError = {
                    message: "El estudiante no existe",
                };

                res.redirect("/admin/grupos/estudiante/" + idGrupo);
                return;
            }

            const resp = await mGrupoUsuario.addUser(idUsuario, idGrupo);

            console.log(resp);

            res.redirect("/admin/grupos/estudiante/" + idGrupo);
        } catch (err) {
            console.log(err);
        }
    },

    getFormAddProfesorGrupo: async (req, res) => {
        const id = parseInt(req.params.id);

        const profesores = await mProfesor.get();

        res.render("admin/grupos/add_profesor", {
            title: `Grupo ${id} Agregar Profesor - Admin`,
            profesores,
            grupo_id: id,
            error: req.session.adminError,
        });
    },

    addProfesorGrupo: async (req, res) => {
        try {
            const idUsuario = parseInt(req.query.id_usuario); // ID del profesor
            const idGrupo = parseInt(req.query.id_grupo); // ID del grupo

            // Validar si el profesor existe
            const profesor = await mProfesor.getOneId(idUsuario); // Cambiar "mProfesor" según la implementación para obtener un profesor por ID

            if (!profesor) {
                req.session.adminError = {
                    message: "El profesor no existe",
                };

                res.redirect(`/admin/grupos/${idGrupo}`);
                return;
            }

            // Obtener el grupo para verificar si ya tiene un profesor
            const grupo = await mGrupoUsuario.getOne(idGrupo);

            if (grupo.profesor) {
                // Si ya hay un profesor en el grupo, eliminarlo
                await mGrupoUsuario.removeUser(grupo.profesor.usuario_grupo_id);
            }

            // Añadir el nuevo profesor al grupo
            const resp = await mGrupoUsuario.addUser(idUsuario, idGrupo);

            req.session.adminSuccess = {
                message: "Profesor añadido al grupo correctamente",
            };

            res.redirect(`/admin/grupos/${idGrupo}`);
        } catch (err) {
            console.error(err);
            req.session.adminError = {
                message: "Error al añadir el profesor al grupo",
            };

            res.redirect(`/admin/grupos/${idGrupo}`);
        }
    },

    removeEstudianteGrupo: async (req, res) => {
        try {
            const usuarioGrupoId = parseInt(req.query.usuario_grupo_id); // ID del estudiante
            const idGrupo = parseInt(req.query.id_grupo);

            // Eliminar el estudiante del grupo
            const resp = await mGrupoUsuario.removeUser(usuarioGrupoId);

            res.redirect(`/admin/grupos/${idGrupo}`);
        } catch (err) {
            console.error(err);
            req.session.adminError = {
                message: "Error al eliminar el estudiante del grupo",
            };

            res.redirect(`/admin/grupos/estudiante/${idGrupo}`);
        }
    },

    removeProfesorGrupo: async (req, res) => {
        try {
            const usuarioGrupoId = parseInt(req.query.usuario_grupo_id); // ID de la relación usuario-grupo
            const idGrupo = parseInt(req.query.id_grupo); // ID del grupo

            console.log(usuarioGrupoId, idGrupo);

            // Eliminar el profesor del grupo
            const resp = await mGrupoUsuario.removeUser(usuarioGrupoId);

            console.log(resp);

            res.redirect(`/admin/grupos/${idGrupo}`);
        } catch (err) {
            console.error(err);
            req.session.adminError = {
                message: "Error al eliminar el profesor del grupo",
            };

            res.redirect(`/admin/grupos/${idGrupo}`);
        }
    },
};

export default cAdmin;

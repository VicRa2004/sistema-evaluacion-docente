import mEstudiante from "../../models/mEstudiante.js";
import mCarrera from "../../models/mCarrera.js";
import { formatDate, formatDateForm } from "../../libs/formatDate.js";

const cEstudiante = {
    getEstudiantes: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const query = req.query.busqueda || "";

        let results = null;

        results = await mEstudiante.getBusqueda(page, query);

        const estudiantes = results.map((estudiante) => {
            const estudiante_fecha_alta = formatDate(
                estudiante.estudiante_fecha_alta
            );

            const estudiante_fecha_nacimiento = formatDate(
                estudiante.estudiante_fecha_nacimiento
            );

            const newEstudiante = {
                ...estudiante,
                estudiante_fecha_nacimiento,
                estudiante_fecha_alta,
            };

            return newEstudiante;
        });

        const error = req.session.estudianteError;

        req.session.estudianteError = null;

        res.render("admin/cruds/estudiante/index", {
            title: "Admin - Estudiantes",
            estudiantes,
            currentPage: page,
            error,
            query,
        });
    },

    buscarEstudiantes: async (req, res) => {
        const query = req.body.estudiante_busqueda;

        res.redirect(`/admin/estudiante?busqueda=${query}`);
    },

    getEstudianteCreate: async (req, res) => {
        const carreras = await mCarrera.get();

        res.render("admin/cruds/estudiante/create", {
            title: "Estudiante - Create",
            error: req.session.estudianteError,
            carreras,
        });
    },
    estudianteCreate: async (req, res) => {
        try {
            const estudiante = {
                nombres: req.body.est_nombres,
                clave: req.body.est_clave,
                password: req.body.est_password,
                apellido_paterno: req.body.est_apellido_paterno,
                apellido_materno: req.body.est_apellido_materno,
                fecha_nacimiento: req.body.est_fecha_nacimiento,
                genero: req.body.est_genero,
                carrera_id: req.body.est_carrera_id,
            };

            if (
                !estudiante.nombres ||
                !estudiante.clave ||
                !estudiante.password ||
                !estudiante.apellido_materno ||
                !estudiante.apellido_paterno ||
                !estudiante.fecha_nacimiento ||
                !estudiante.genero ||
                !estudiante.carrera_id
            ) {
                req.session.estudianteError = {
                    message: "Debe de rellenar todos los campos",
                };
                res.redirect("/admin/estudiante/create");
                return;
            }

            const results = await mEstudiante.create(estudiante);

            req.session.academiaError = null;

            res.redirect("/admin/estudiante");
        } catch (err) {
            req.session.academiaError = {
                message: err.message,
            };
            res.redirect("/admin/estudiante/create");
        }
    },

    getEstudianteUpdate: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const estudiante = await mEstudiante.getOneId(id);
            const carreras = await mCarrera.get();

            const newEstudiante = {
                ...estudiante,
                estudiante_fecha_nacimiento: formatDateForm(
                    estudiante.estudiante_fecha_nacimiento
                ),
                estudiante_fecha_alta: formatDateForm(
                    estudiante.estudiante_fecha_alta
                ),
                estudiante_fecha_baja:
                    estudiante.estudiante_fecha_baja &&
                    formatDateForm(estudiante.estudiante_fecha_baja),
            };

            res.render("admin/cruds/estudiante/update", {
                title: "Estudiante - Update",
                estudiante: newEstudiante,
                carreras,
                error: req.session.estudianteError,
            });
        } catch (err) {
            req.session.estudianteError = {
                message: err.message,
            };
            res.redirect("/admin/estudiante/update/" + id);
        }
    },
    estudianteUpdate: async (req, res) => {
        const id = req.params.id;
        try {
            const estudiante = {
                id,
                nombres: req.body.est_nombres,
                clave: req.body.est_clave,
                password: req.body.est_password,
                apellido_paterno: req.body.est_apellido_paterno,
                apellido_materno: req.body.est_apellido_materno,
                fecha_nacimiento: req.body.est_fecha_nacimiento,
                genero: req.body.est_genero,
                carrera_id: req.body.est_carrera_id,
                activo: req.body.est_activo,
                fecha_alta: req.body.est_fecha_alta,
                fecha_baja: req.body.est_fecha_baja,
            };

            if (
                !estudiante.nombres ||
                !estudiante.clave ||
                !estudiante.password ||
                !estudiante.apellido_materno ||
                !estudiante.apellido_paterno ||
                !estudiante.fecha_nacimiento ||
                !estudiante.genero ||
                !estudiante.carrera_id
            ) {
                req.session.estudianteError = {
                    message: "Debe de rellenar todos los campos",
                };
                res.redirect("/admin/estudiante/update/" + id);
                return;
            }

            if (estudiante.activo == "on") {
                estudiante.activo = 1;
            } else {
                estudiante.activo = 0;
            }

            console.log(estudiante);

            const results = await mEstudiante.update(estudiante);

            req.session.estudianteError = null;

            res.redirect("/admin/estudiante/");
        } catch (err) {
            req.session.estudianteError = {
                message: err.message,
            };
            res.redirect("/admin/estudiante/update/" + id);
        }
    },

    estudianteDelelte: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            console.log(id);
            const estudiante = await mEstudiante.delete(id);
            req.session.estudianteError = null;

            res.redirect("/admin/estudiante/");
        } catch (err) {
            req.session.academiaError = {
                message: err.message,
            };
            res.redirect("/admin/estudiante/");
        }
    },
};

export default cEstudiante;

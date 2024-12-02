import mProfesor from "../../models/mProfesor.js"; // Modelo del profesor
import mAcademia from "../../models/mAcademia.js"; // Modelo para Academia
import mDepartamento from "../../models/mDepartamento.js"; // Modelo para Departamento Académico
import { formatDate, formatDateForm } from "../../libs/formatDate.js";

const cProfesor = {
    getProfesores: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const query = req.query.busqueda || "";

        let results = null;

        results = await mProfesor.getBusqueda(page, query);

        const profesores = results.map((profesor) => {
            const profesor_fecha_alta = formatDate(
                profesor.profesor_fecha_alta
            );
            const profesor_fecha_nacimiento = formatDate(
                profesor.profesor_fecha_nacimiento
            );

            const newProfesor = {
                ...profesor,
                profesor_fecha_nacimiento,
                profesor_fecha_alta,
            };

            return newProfesor;
        });

        const error = req.session.profesorError;
        req.session.profesorError = null;

        res.render("admin/cruds/profesor/index", {
            title: "Admin - Profesores",
            profesores,
            currentPage: page,
            error,
            query,
        });
    },

    buscarProfesores: async (req, res) => {
        const query = req.body.estudiante_busqueda;

        res.redirect(`/admin/profesor?busqueda=${query}`);
    },

    getProfesorCreate: async (req, res) => {
        const academias = await mAcademia.get();
        const departamentos = await mDepartamento.get();

        res.render("admin/cruds/profesor/create", {
            title: "Profesor - Create",
            error: req.session.profesorError,
            academias,
            departamentos,
        });
    },
    profesorCreate: async (req, res) => {
        try {
            const profesor = {
                nombres: req.body.prof_nombres,
                clave: req.body.prof_clave,
                password: req.body.prof_password,
                apellido_paterno: req.body.prof_apellido_paterno,
                apellido_materno: req.body.prof_apellido_materno,
                fecha_nacimiento: req.body.prof_fecha_nacimiento,
                genero: req.body.prof_genero,
                academia_id: req.body.prof_academia_id,
                departamento_id: req.body.prof_departamento_id,
            };

            if (
                !profesor.nombres ||
                !profesor.clave ||
                !profesor.password ||
                !profesor.apellido_materno ||
                !profesor.apellido_paterno ||
                !profesor.fecha_nacimiento ||
                !profesor.genero ||
                !profesor.academia_id ||
                !profesor.departamento_id
            ) {
                req.session.profesorError = {
                    message: "Debe rellenar todos los campos",
                };
                res.redirect("/admin/profesor/create");
                return;
            }

            const results = await mProfesor.create(profesor);

            req.session.profesorError = null;

            res.redirect("/admin/profesor");
        } catch (err) {
            req.session.profesorError = {
                message: err.message,
            };
            res.redirect("/admin/profesor/create");
        }
    },
    getProfesorUpdate: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const profesor = await mProfesor.getOneId(id);
            const academias = await mAcademia.get();
            const departamentos = await mDepartamento.get();

            const newProfesor = {
                ...profesor,
                profesor_fecha_nacimiento: formatDateForm(
                    profesor.profesor_fecha_nacimiento
                ),
                profesor_fecha_alta: formatDateForm(
                    profesor.profesor_fecha_alta
                ),
                profesor_fecha_baja:
                    profesor.profesor_fecha_baja &&
                    formatDateForm(profesor.profesor_fecha_baja),
            };

            res.render("admin/cruds/profesor/update", {
                title: "Profesor - Update",
                profesor: newProfesor,
                academias,
                departamentos,
                error: req.session.profesorError,
            });
        } catch (err) {
            req.session.profesorError = {
                message: err.message,
            };
            res.redirect("/admin/profesor/update/" + id);
        }
    },
    profesorUpdate: async (req, res) => {
        const id = req.params.id;
        try {
            const profesor = {
                id,
                nombres: req.body.prof_nombres,
                clave: req.body.prof_clave,
                password: req.body.prof_password,
                apellido_paterno: req.body.prof_apellido_paterno,
                apellido_materno: req.body.prof_apellido_materno,
                fecha_nacimiento: req.body.prof_fecha_nacimiento,
                genero: req.body.prof_genero,
                academia_id: req.body.prof_academia_id,
                departamento_id: req.body.prof_departamento_id,
                activo: req.body.prof_activo,
                fecha_alta: req.body.prof_fecha_alta,
                fecha_baja: req.body.prof_fecha_baja,
            };

            if (
                !profesor.nombres ||
                !profesor.clave ||
                !profesor.password ||
                !profesor.apellido_materno ||
                !profesor.apellido_paterno ||
                !profesor.fecha_nacimiento ||
                !profesor.genero ||
                !profesor.academia_id ||
                !profesor.departamento_id
            ) {
                req.session.profesorError = {
                    message: "Debe rellenar todos los campos",
                };
                res.redirect("/admin/profesor/update/" + id);
                return;
            }

            profesor.activo = profesor.activo === "on" ? 1 : 0;

            const results = await mProfesor.update(profesor);

            req.session.profesorError = null;

            res.redirect("/admin/profesor/");
        } catch (err) {
            req.session.profesorError = {
                message: err.message,
            };
            res.redirect("/admin/profesor/update/" + id);
        }
    },
    profesorDelete: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const profesor = await mProfesor.delete(id);
            req.session.profesorError = null;

            res.redirect("/admin/profesor/");
        } catch (err) {
            req.session.profesorError = {
                message: err.message,
            };
            res.redirect("/admin/profesor/");
        }
    },
};

export default cProfesor;

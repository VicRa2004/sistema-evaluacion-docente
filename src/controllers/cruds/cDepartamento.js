import mDepartamento from "../../models/mDepartamento.js";
import mAcademia from "../../models/mAcademia.js";
import { formatDate, formatDateForm } from "../../libs/formatDate.js";

const cDepartamento = {
    getDepartamento: async (req, res) => {
        const results = await mDepartamento.get();

        const departamentos = results.map((departamento) => {
            const departamento_fecha_de_creacion = formatDate(
                departamento.departamento_fecha_de_creacion
            );
            return {
                ...departamento,
                departamento_fecha_de_creacion,
            };
        });

        const error = req.session.departamentoError;

        req.session.departamentoError = null;

        res.render("admin/cruds/departamento/index", {
            title: "Departamentos",
            departamentos,
            error,
        });
    },
    getDepartamentoCreate: async (req, res) => {
        const academias = await mAcademia.get();

        res.render("admin/cruds/departamento/create", {
            title: "Departamentos - Create",
            academias,
            error: req.session.departamentoError,
        });
    },
    departamentoCreate: async (req, res) => {
        try {
            const departamento = {
                nombre: req.body.depa_nombre,
                descripcion: req.body.depa_descripcion,
                academia_id: req.body.depa_aca_id,
                fecha_de_creacion: req.body.depa_fecha,
            };

            if (
                !departamento.nombre ||
                !departamento.descripcion ||
                !departamento.academia_id ||
                !departamento.fecha_de_creacion
            ) {
                req.session.departamentoError = {
                    message: "Debe de rellenar todos los campos",
                };
                res.redirect("/admin/departamento/create");
                return;
            }

            const results = await mDepartamento.create(departamento);

            req.session.departamentoError = null;

            res.redirect("/admin/departamento/");
        } catch (err) {
            req.session.departamentoError = {
                message: err.message,
            };
            res.redirect("/admin/departamento/create");
        }
    },
    getDepartamentoUpdate: async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            const academias = await mAcademia.get();
            const departamento = await mDepartamento.getOne(id);

            const newdepartamento = {
                ...departamento,
                departamento_fecha_de_creacion: formatDateForm(
                    departamento.departamento_fecha_de_creacion
                ),
            };

            res.render("admin/cruds/departamento/update", {
                title: "Departamentos - Update",
                departamento: newdepartamento,
                academias,
                error: req.session.departamentoError,
            });
        } catch (err) {
            req.session.departamentoError = {
                message: err.message,
            };
            res.redirect("/admin/departamento/update/" + id);
        }
    },
    departamentoUpdate: async (req, res) => {
        try {
            console.log(req.body);
            const departamento = {
                id: req.body.depa_id,
                nombre: req.body.depa_nombre,
                descripcion: req.body.depa_descripcion,
                activo: req.body.depa_activo,
                academia_id: req.body.depa_aca_id,
                fecha_de_creacion: req.body.depa_fecha,
            };

            console.log(departamento);

            if (departamento.activo == "on") {
                departamento.activo = 1;
            } else {
                departamento.activo = 0;
            }

            if (
                !departamento.id ||
                !departamento.nombre ||
                !departamento.descripcion ||
                !departamento.academia_id ||
                !departamento.fecha_de_creacion
            ) {
                req.session.departamentoError = {
                    message: "Debe de rellenar todos los campos",
                };
                res.redirect("/admin/departamento/update/" + req.body.depa_id);
                return;
            }

            const results = await mDepartamento.update(departamento);

            req.session.departamentoError = null;

            res.redirect("/admin/departamento/");
        } catch (err) {
            req.session.departamentoError = {
                message: err.message,
            };
            res.redirect("/admin/departamento/update/" + id);
        }
    },

    departamentoDelelte: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            console.log(id);
            const departamento = await mDepartamento.delete(id);
            req.session.departamentoError = null;

            res.redirect("/admin/departamento/");
        } catch (err) {
            req.session.departamentoError = {
                message: err.message,
            };
            res.redirect("/admin/departamento/");
        }
    },
};

export default cDepartamento;

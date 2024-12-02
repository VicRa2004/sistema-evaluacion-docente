import { formatDate } from "../libs/formatDate.js";
import mGrupo from "../models/mGrupo.js";
import mGrupoUsuario from "../models/mGrupoUsuario.js";
import mResultado from '../models/mResultado.js'
import mCriterio from '../models/mCriterio.js'

const cProfesor = {
    logout: (req, res) => {
        req.session.destroy();
        res.redirect("/login");
    },
    getIndex: (req, res) => {
        res.render("profesor/", { title: "Profesor" });
    },
    getPerfil: (req, res) => {
        const profesor = { ...req.session.profesor };

        const profesor_fecha_alta = formatDate(profesor.usuario_fecha_alta);

        const newProfesor = {
            ...profesor,
            profesor_fecha_alta,
        };

        res.render("profesor/perfil", {
            title: "profesor- Perfil",
            profesor: newProfesor,
        });
    },
    getGrupos: async (req, res) => {
        const id = req.session.profesor.usuario_id;
        const grupos = await mGrupo.getGruposProfesor(id);

        console.log(grupos);

        res.render("profesor/grupos", {
            title: "Profesor - Grupos",
            grupos,
        });
    },

    getGrupoInfo: async (req, res) => {
        const grupoId = req.params.id;

        const grupos = await mGrupoUsuario.getOne(grupoId);

        console.log(grupos);

        res.render("profesor/grupos/info", {
            title: "Profesor - Grupos",
            ...grupos,
        });
    },

    getResultados: async (req, res) => {
        const criterios = await mCriterio.get();
        const id_profesor = req.session.profesor.usuario_id;

        const resultados = await Promise.all(
            criterios.map(async (criterio) => {
                return await mResultado.getResultadosGenerales({
                    id_profesor,
                    id_criterio: criterio.criterio_id,
                });
            })
        );

        res.render("profesor/resultados", {
            title: "Profesor - Resultados",
            resultados,
        })
    }
};

export default cProfesor;

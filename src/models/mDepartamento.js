import db from "../config/db.js";

const mDepartamento = {
    create: async (departamento) => {
        try {
            const [results] = await db.query(
                "call Departamento_Academico_insert(?, ?, ?, ?);",
                [
                    departamento.nombre,
                    departamento.descripcion,
                    departamento.academia_id,
                    departamento.fecha_de_creacion,
                ]
            );
            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al crear el usuario ${departamento.nombre}`,
            };
        }
    },
    get: async () => {
        try {
            const [results] = await db.query(
                "call Departamento_Academico_select(null);"
            );
            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: `Error al cargar los datos`,
            };
        }
    },
    getOne: async (id) => {
        try {
            const [results] = await db.query(
                "call Departamento_Academico_select(?)",
                [id]
            );
            return results[0][0];
        } catch (err) {
            console.log(err);
            throw {
                status: 404,
                message: `Error el departamento no existe no existe`,
            };
        }
    },
    update: async (departamento) => {
        try {
            const [results] = await db.query(
                "call Departamento_Academico_update(?, ?, ?, ?, ?, ?);",
                [
                    departamento.id,
                    departamento.nombre,
                    departamento.descripcion,
                    departamento.activo,
                    departamento.academia_id,
                    departamento.fecha_de_creacion,
                ]
            );
            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al crear el usuario ${departamento.nombre}`,
            };
        }
    },
    delete: async (id) => {
        try {
            const [results] = await db.query(
                "call Departamento_Academico_delete(?);",
                [id]
            );
            return results[0];
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al eliminar la academia`,
            };
        }
    },
};

export default mDepartamento;

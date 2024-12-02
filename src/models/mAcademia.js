import db from "../config/db.js";

const mAcademia = {
    create: async (academia) => {
        try {
            const [results] = await db.query("call Academia_insert(?, ?, ?);", [
                academia.nombre,
                academia.descripcion,
                academia.fecha_de_creacion,
            ]);
            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al crear la academia ${academia.nombre}`,
            };
        }
    },

    get: async () => {
        try {
            const [results] = await db.query("call academia_select(null);");
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
            const [results] = await db.query("call academia_select(?)", [id]);
            return results[0][0];
        } catch (err) {
            console.log(err);
            throw {
                status: 404,
                message: `Error el Administrador no existe no existe`,
            };
        }
    },
    update: async (academia) => {
        try {
            const [results] = await db.query(
                "call Academia_update(?, ?, ?, ?, ?);",
                [
                    academia.id,
                    academia.nombre,
                    academia.descripcion,
                    academia.activo,
                    academia.fecha_de_creacion,
                ]
            );
            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al crear el usuario ${academia.nombre}`,
            };
        }
    },
    delete: async (id) => {
        try {
            const [results] = await db.query("call Academia_delete(?);", [id]);
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

export default mAcademia;

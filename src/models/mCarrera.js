import db from "../config/db.js";

const mCarrera = {
    create: async (carrera) => {
        try {
            const [results] = await db.query("call carrera_insert(?, ?);", [
                carrera.clave,
                carrera.nombre,
            ]);
            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al crear el usuario ${carrera.nombre}`,
            };
        }
    },
    get: async () => {
        try {
            const [results] = await db.query("call carrera_select(null);");
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
            const [results] = await db.query("call carrera_select(?)", [id]);
            return results[0][0];
        } catch (err) {
            console.log(err);
            throw {
                status: 404,
                message: `Error la carrera no existe no existe`,
            };
        }
    },
    update: async (carrera) => {
        try {
            const [results] = await db.query("call carrera_update(?, ?, ?);", [
                carrera.id,
                carrera.clave,
                carrera.nombre,
            ]);
            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al actualizar el usuario ${carrera.nombre}`,
            };
        }
    },
    delete: async (id) => {
        try {
            const [results] = await db.query("call carrera_delete(?);", [id]);
            return results[0];
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al eliminar la carrera`,
            };
        }
    },
};

export default mCarrera;

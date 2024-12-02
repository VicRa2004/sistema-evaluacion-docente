import db from "../config/db.js";

const mCriterio = {
    // Crear un nuevo ciclo escolar
    create: async (criterio) => {
        try {
            const [results] = await db.query(
                "CALL Criterios_insert(?, ?, ?);",
                [criterio.nombre, criterio.descripcion, 1]
            );
            return results;
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al crear el ciclo escolar ${ciclo.nombre}`,
            };
        }
    },

    // Obtener todos los ciclos escolares
    get: async () => {
        try {
            const [results] = await db.query("CALL Criterios_select(NULL);");
            return results[0];
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: "Error al cargar los datos de los ciclos escolares",
            };
        }
    },

    // Obtener un ciclo escolar específico por ID
    getOne: async (id) => {
        try {
            const [results] = await db.query("call Criterios_select(?);", [id]);
            return results[0][0];
        } catch (err) {
            console.error(err);
            throw {
                status: 404,
                message: `Error: el criterio con ID ${id} no existe`,
            };
        }
    },

    getOneName: async (name) => {
        try {
            const [results] = await db.query(
                "call Criterios_select_by_name(?);",
                [name]
            );
            return results[0][0];
        } catch (err) {
            console.error(err);
            throw {
                status: 404,
                message: `Error: el criterio con nombre ${name} no existe`,
            };
        }
    },

    update: async (criterio) => {
        try {
            const [results] = await db.query(
                "CALL Criterios_update(?, ?, ?, ?);",
                [
                    criterio.id,
                    criterio.nombre,
                    criterio.descripcion,
                    criterio.activo,
                ]
            );
            return results;
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al actualizar el criterio ${criterio.nombre}`,
            };
        }
    },

    // Eliminar un ciclo escolar
    delete: async (id) => {
        try {
            const [results] = await db.query("CALL Criterios_delete(?);", [id]);
            return results;
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al eliminar el criterio con ID ${id}`,
            };
        }
    },
};

export default mCriterio;

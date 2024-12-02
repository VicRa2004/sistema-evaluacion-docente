import db from "../config/db.js";

const mAdmin = {
    create: async (user) => {
        try {
            const [results] = await db.query("CALL user_insert(?, ?);", [
                user.username,
                user.password,
            ]);
            return results;
        } catch (err) {
            throw {
                status: 500,
                message: `Error al crear el usuario ${user.username}`,
            };
        }
    },
    get: async () => {
        try {
            const [results] = await db.query("CALL user_select(null);");
            return results;
        } catch (err) {
            throw {
                status: 500,
                message: `Error al crear el usuario ${user.username}`,
            };
        }
    },
    getOne: async (clave) => {
        try {
            const [results] = await db.query(
                "SELECT * FROM Administrador WHERE administrador_clave = ? ;",
                [clave]
            );

            if (!results[0]) {
                throw {
                    status: 404,
                    message: `Error el Administrador no existe`,
                };
            }

            return results[0];
        } catch (err) {
            console.log(err);
            throw {
                status: 404,
                message: `Error el Administrador no existe`,
            };
        }
    },
    update: async () => {},
    delete: async () => {},
};

export default mAdmin;

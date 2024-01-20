const [db] = await Promise.all([import("./db.js")]);

export const schema = {
    db,
};

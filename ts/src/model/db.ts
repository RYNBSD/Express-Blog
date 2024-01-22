import { DataTypes } from "sequelize";
import type { Tables } from "../types/index.js";

export const User = sequelize.define<Tables["User"]>(
    "user",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(70),
            allowNull: false,
        },
        picture: {
            type: DataTypes.STRING(70),
        },
    },
    {
        timestamps: true,
        tableName: "user"
    }
);

export const Blog = sequelize.define<Tables["Blog"]>(
    "blog",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        bloggerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
    },
    {
        timestamps: true,
        tableName: "blog"
    }
);

export const BlogImages = sequelize.define<Tables["BlogImages"]>(
    "blogImages",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        image: {
            type: DataTypes.STRING(70),
            allowNull: false,
        },
        blogId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Blog,
                key: "id",
            },
        },
    },
    { createdAt: true, updatedAt: false, tableName: "blogImages" }
);

export const BlogLikes = sequelize.define<Tables["BlogLikes"]>(
    "blogLikes",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        likerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            }
        },
        blogId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Blog,
                key: "id"
            }
        }
    },
    { createdAt: true, updatedAt: false, tableName: "blogLikes" }
);

export const BlogComments = sequelize.define<Tables["BlogComments"]>(
    "blogComments",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        comment: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        blogId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Blog,
                key: "id"
            }
        },
        commenterId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            }
        }
    },
    {
        timestamps: true,
        tableName: "blogComments"
    }
);

export const Error = sequelize.define<Tables["Error"]>(
    "error",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        isFixed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    },
    {
        timestamps: true,
        tableName: "error"
    }
);

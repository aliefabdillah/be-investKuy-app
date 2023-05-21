import { DataTypes } from "sequelize";
import db from "../configs/db.config.js";
import Users from "./users.model.js";

export const Verification = db.define("t_verification", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    ktpImg_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ktpImg_filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pasFoto_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pasFoto_filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nik: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tgl_lahir: {
        type: DataTypes.DATE,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
})

Verification.belongsTo(Users, {
    foreignKey: "userId",
    as: "userDetails",
    onDelete: "CASCADE"
})
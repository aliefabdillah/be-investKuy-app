import { DataTypes } from "sequelize";
import db from "../configs/db.config.js";
import { Pengajuan } from "./pengajuan.model.js";
import Users from "./users.model.js";

export const Pendanaan = db.define("t_pendanaan", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    nominal: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    repayment: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    profit:{
        type: DataTypes.INTEGER,
    },
    weekly_profit: {
        type: DataTypes.INTEGER
    },
    weekly_income: {
        type: DataTypes.INTEGER
    },
    tgl_selesai:{
        type: DataTypes.DATE
    },
    status:{
        type: DataTypes.STRING,
        defaultValue: "In Progress"
    }
},{
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
})

Pendanaan.belongsTo(Pengajuan, {
    foreignKey: "pengajuanId",
    as: "pengajuanDetails",
    onDelete: "CASCADE",
})

Pendanaan.belongsTo(Users, {
    foreignKey: "investorId",
    as: "investorDetails",
    onDelete: "CASCADE"
})
import { DataTypes } from "sequelize";
import db from "../configs/db.config.js";
import Users from "./users.model.js";

export const Pengajuan = db.define("t_pengajuan", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pekerjaan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sektor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    penghasilan: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    plafond: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tenor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bagi_hasil: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jenis_angsuran: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jml_angsuran: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    akad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tgl_mulai:{
        type: DataTypes.DATE,
        allowNull: false
    },
    tgl_berakhir:{
        type: DataTypes.DATE,
        allowNull: false
    },
    tgl_mulai_bayar:{
        type: DataTypes.DATE,
    },
    jml_pendanaan:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "In Progress"
    },
    is_withdraw:{
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    angsuran_dibayar:{
        type: DataTypes.INTEGER,
        defaultValue: 0
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
});

Pengajuan.belongsTo(Users, {
    foreignKey: 'pemilikId',
    as: 'pemilikDetails',
    onDelete: 'CASCADE'
})
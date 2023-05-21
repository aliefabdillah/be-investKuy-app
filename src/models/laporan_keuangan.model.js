import { DataTypes } from "sequelize";
import db from '../configs/db.config.js';
import { Pengajuan } from "./pengajuan.model.js";

export const LaporanKeuangan = db.define("t_laporan_keuangan",{
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    laporan_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    laporan_filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
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

LaporanKeuangan.belongsTo(Pengajuan, {
    foreignKey: 'pengajuanId',
    as: 'daftarLaporanKeuangan',
    onDelete: 'CASCADE'
})
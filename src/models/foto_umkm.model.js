import { DataTypes } from "sequelize";
import db from '../configs/db.config.js';
import { Pengajuan } from "./pengajuan.model.js";

export const FotoUmkm = db.define("t_foto_umkm",{
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    image1_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image2_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image3_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image1_filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image2_filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image3_filename: {
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

FotoUmkm.belongsTo(Pengajuan, {
    foreignKey: 'pengajuanId',
    as: 'daftarFotoUmkm',
    onDelete: 'CASCADE'
})
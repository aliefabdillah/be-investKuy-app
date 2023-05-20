import { DataTypes } from "sequelize";
import { Admin } from "./admin.model.js";
import db from '../configs/db.config.js';

//programms attribute users schema
export const Artikel = db.define("t_articles", {
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    tgl_terbit:{
        type: DataTypes.DATE,
    },
    konten:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    img_url:{
        type: DataTypes.STRING,
    },
    filename:{
        type: DataTypes.STRING
    },
    createdAt: {
       type: DataTypes.DATE,
       allowNull: false,
       defaultValue: DataTypes.NOW
    },
    updatedAt: {
       type: DataTypes.DATE,
       allowNull: false,
       defaultValue: DataTypes.NOW
    },
},{
    freezeTableName: true
})

Artikel.belongsTo(Admin, { foreignKey: 'adminId'})
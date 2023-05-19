import { DataTypes } from "sequelize";
import { Admin } from "./admin.model.js";
import db from '../configs/db.config.js';

//programms attribute users schema
export const Faq = db.define("t_faq", {
    id:{
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    question:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    answer:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category:{
        type: DataTypes.STRING,
        allowNull: false,
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

Faq.belongsTo(Admin, {foreignKey: 'adminId'})

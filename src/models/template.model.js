import { DataTypes } from "sequelize";
import db from '../configs/db.config.js';

//programms attribute users schema
export const Test = db.define("testModel", {
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    dekripsi:{
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
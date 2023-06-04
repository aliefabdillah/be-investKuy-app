import { DataTypes } from "sequelize";
import db from '../configs/db.config.js';
import Merchants from "./merchant.model.js";
import Users from './users.model.js';

const Rekening = db.define('t_rekenings', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  no_rekening: {
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
    },
  },
});

Rekening.belongsTo(Merchants, {
  foreignKey: 'merchantId',
  as: 'merchantsDetails',
  onDelete: 'CASCADE'
});

Rekening.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'userDetails',
  onDelete: 'CASCADE'
});

export default Rekening;
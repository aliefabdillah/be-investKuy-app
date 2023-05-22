import { DataTypes } from 'sequelize';
import db from '../configs/db.config.js';

const Users = db.define('t_users', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  pin: {
    type: DataTypes.STRING
  },
  no_telepon: {
    type: DataTypes.STRING
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  token: {
    type: DataTypes.STRING
  },
  img_url:{
    type: DataTypes.STRING,
  },
  img_filename:{
    type: DataTypes.STRING
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

// Users.hasOne(Wallets, {
//   foreignKey: 'userId'
// });

Users.associate = function (models) {
  this.hasOne(models.t_wallets, { foreignKey: 'userId' });
};

export default Users;
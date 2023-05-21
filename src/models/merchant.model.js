import { DataTypes } from 'sequelize';
import db from '../configs/db.config.js';

const Merchants = db.define('t_merchants', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
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

// Merchants.hasMany(WalletWithdraws, {
//   foreignKey: 'merchantId'
// });

// Merchants.hasMany(WalletDeposits, {
//   foreignKey: 'merchantId'
// });

/* Merchants.associate = function (models) {
  this.hasMany(models.t_wallet_credits, { foreignKey: 'merchantId' });
  this.hasMany(models.t_wallet_debits, { foreignKey: 'merchantId' });
}; */

export default Merchants;
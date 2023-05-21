import { DataTypes } from 'sequelize';
import db from '../configs/db.config.js';

const Wallets = db.define('t_wallets', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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

// Wallets.belongsTo(Users, {
//   foreignKey: 'userId'
// });

// Wallets.hasMany(WalletWithdraws, {
//   foreignKey: 'walletId'
// });

// Wallets.hasMany(WalletDeposit, {
//   foreignKey: 'walletId'
// });

Wallets.associate = function (models) {
  this.belongsTo(models.t_users, { foreignKey: 'userId' });
  this.hasMany(models.t_wallet_debits, { foreignKey: 'walletId' });
  this.hasMany(models.t_wallet_credits, { foreignKey: 'walletId' });
};

export default Wallets;
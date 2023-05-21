import { DataTypes } from 'sequelize';
import db from '../configs/db.config.js';

const WalletDebits = db.define('t_wallet_debits', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  transactionCode: {
    type: DataTypes.STRING,
    unique: true
  },
  paymentCode: {
    type: DataTypes.STRING,
    unique: true
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

// WalletWithdraws.belongsTo(Wallets, {
//   foreignKey: 'walletId'
// });

// WalletWithdraws.belongsTo(Merchants, {
//   foreignKey: 'merchantId'
// });

WalletDebits.associate = function (models) {
  this.belongsTo(models.t_wallets, { foreignKey: 'walletId' });
  this.belongsTo(models.t_merchants, { foreignKey: 'merchantId' });
};

export default WalletDebits;
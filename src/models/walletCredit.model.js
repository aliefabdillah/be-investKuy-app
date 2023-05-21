import { DataTypes } from 'sequelize';
import db from '../configs/db.config.js';

const walletCredits = db.define('t_wallet_credits', {
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

// WalletDeposits.belongsTo(Wallets, {
//   foreignKey: 'walletId'
// });

// WalletDeposits.belongsTo(Merchants, {
//   foreignKey: 'merchantId'
// });

walletCredits.associate = function (models) {
  this.belongsTo(models.t_wallets, { foreignKey: 'walletId' });
  this.belongsTo(models.t_merchants, { foreignKey: 'merchantId' });
};

export default walletCredits;
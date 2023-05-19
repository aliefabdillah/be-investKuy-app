import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

// Sinkron table pada db dari model
/* db.sync({alter:true})
  .then(() => {
    console.log('Tabel berhasil di sinkronisasi');
  })
  .catch((error) => {
    console.error('Terjadi kesalahan:', error);
  }); */

export default db;

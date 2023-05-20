import express from "express";
import router from "./src/routes/index.route.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./src/configs/db.config.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
dotenv.config()

// import { Admin } from "./src/models/admin.model.js";
// import { Artikel } from "./src/models/artikel.model.js";
// import { Faq } from "./src/models/faq.model.js";
// import Users from "./src/models/users.model.js";
// import { Pengajuan } from "./src/models/pengajuan.model.js";
// import { FotoUmkm } from "./src/models/foto_umkm.model.js";
// import { LaporanKeuangan } from "./src/models/laporan_keuangan.model.js";


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization']
}))

/* try {
    await db.authenticate();
    // await Test.sync();
    // await Admin.sync()
    // await Artikel.sync();
    // await Faq.sync()
    // await Users.sync()
    // await Pengajuan.sync()
    await FotoUmkm.sync()
    await LaporanKeuangan.sync()
} catch (error) {
    console.log(error)
} */


app.use(router)
app.use(cookieParser());
app.use(express.json);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});

    return;
});

app.listen(port, '0.0.0.0', () => {
    console.log(`App listening at http://localhost:${port}`)
});
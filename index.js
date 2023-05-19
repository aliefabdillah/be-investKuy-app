import express from "express";
// import router from "./src/routes/index.route.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./src/configs/db.config.js";
import { Test } from "./src/models/template.model.js";
dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/* try {
    await db.authenticate();
    // await Test.sync();
} catch (error) {
    console.log(error)
} */

app.use(express.json);
app.get('/', (req, res) => {
    res.json({'Message': 'ok'})
})

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
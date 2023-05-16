import express from "express";
import router from "./src/routes/index.route";
import dotenv from "dotenv";
dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(router);
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
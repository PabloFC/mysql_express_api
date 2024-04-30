const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const fileUpload = require("express-fileupload");
const orderRouter = require("./routes/orderRouter");
dotenv.config();

const app = express();
const port = process.env.PORT;

//middlewares de express
app.use(logger("dev"));
app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use(
  fileUpload({
    createParentPath: true, // Crea la carpeta donde almacenamos las imágenes si no ha sido creada.
    limits: { fileSize: 20 * 1024 * 1024 }, // Limitamos el tamaño de la imagen a 20mb. Por defecto son 50mb.
    abortOnLimit: true, // Interrumpe la carga del archivo si supera el límite especificado.
    responseOnLimit: "Imagen demasiado grande", // Enviamos un mensaje de respuesta cuando se interrumpe la carga
    uploadTimeout: 0, // Indicamos el tiempo de respuesta si se interrumpe la carga de la imagen.
  })
);

//Peticiones de Nuesta API
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

//servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

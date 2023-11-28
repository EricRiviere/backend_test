import express from "express";
import { ProductRouter } from "./routers/products.routes.js";
import { CartRouter } from "./routers/carts.routes.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { viewsRouter } from "./routers/views.routes.js";
import { Server } from "socket.io";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

//Static
app.use(express.static(`${__dirname}/public`));

app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/", viewsRouter);

//Array realTimeProducts
const realTimeProducts = [];

//Socket
socketServer.on("connection", (socketClient) => {
  console.log("Nuevo cliente conectado");
  socketClient.on("message", (data) => {
    console.log(data);
  });
  //Form
  socketClient.on("form_message", (data) => {
    console.log(data);
    realTimeProducts.push(data);
    socketClient.emit("products_list", realTimeProducts);
  });

  socketClient.emit("products_list", realTimeProducts);
});

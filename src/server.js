import express from "express";
import { ProductRouter } from "./routers/products.routes.js";
import { CartRouter } from "./routers/carts.routes.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { viewsRouter } from "./routers/views.routes.js";
import { Server } from "socket.io";
import { ProductManager } from "./controllers/ProductManager.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

const socketServer = new Server(httpServer);

const manager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

//Static
app.use(express.static(`${__dirname}/public`));

//Routers
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/", viewsRouter);

//Socket
socketServer.on("connection", async (socketClient) => {
  console.log("Nuevo cliente conectado");
  socketClient.on("message", (data) => {
    console.log(data);
  });
  //Form
  socketClient.on("form_message", async (data) => {
    console.log(data);
    await manager.addProduct(data);

    const updatedProducts = await manager.getProducts();

    socketServer.emit("products_list", updatedProducts);
  });

  socketClient.on("delete_product", async (productId) => {
    try {
      await manager.deleteProduct(productId);

      const updatedProducts = await manager.getProducts();

      socketServer.emit("products_list", updatedProducts);
    } catch (error) {
      console.log(error);
    }
  });

  socketClient.emit("products_list", await manager.getProducts());
});

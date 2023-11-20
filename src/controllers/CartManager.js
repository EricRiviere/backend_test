import fs from "fs";
import { ProductManager } from "./ProductManager.js";
import { nanoid } from "nanoid";

const allProducts = new ProductManager();

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
    if (fs.existsSync(this.path)) {
      let carts = fs.readFileSync(this.path, "utf-8");
      this.carts = JSON.parse(carts);
    } else {
      this.carts = [];
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, "\t"));
    }
  }

  getCarts = async () => {
    try {
      let carts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      console.error("Error reading carts file:", error);
      throw new Error("Error reading carts file");
    }
  };

  writeCarts = async (carts) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      console.error("Error writing carts file:", error);
      throw new Error("Error writing carts file");
    }
  };

  addCart = async () => {
    try {
      let carts = await this.getCarts();
      let cId = nanoid(5);
      let newCart = {
        cartId: cId,
        products: [],
      };
      carts.push(newCart);
      await this.writeCarts(carts);
      return {
        status: "success",
        message: "New cart added",
      };
    } catch (error) {
      console.error("Error adding cart:", error);
      throw new Error("Error adding cart");
    }
  };

  getCartById = async (id) => {
    try {
      let carts = await this.getCarts();
      let cart = carts.find((c) => c.cartId === id);
      if (!cart) {
        throw new Error("Cart not found");
      }
      return {
        status: "success",
        cart,
      };
    } catch (error) {
      console.error("Product not found:", error);
      return { status: "error", error: error.message };
    }
  };

  addProductToCart = async (cId, pId) => {
    try {
      let carts = await this.getCarts();
      let cartFound = carts.find((c) => c.cartId === cId);
      if (!cartFound) {
        throw new Error("Cart not found");
      }
      let productFound = await allProducts.getProductById(pId);
      if (productFound.status === "error") {
        throw new Error("Product not found");
      }
      let productOnCart = cartFound.products.find((p) => p.productId === pId);
      if (!productOnCart) {
        cartFound.products.push({
          productId: pId,
          amount: 1,
        });
        await this.writeCarts(carts);
        return {
          status: "success",
          message: "Product added to cart",
        };
      } else {
        productOnCart.amount++;
        await this.writeCarts(carts);
        return {
          status: "success",
          message: "Product ammount updated in cart",
        };
      }
    } catch (error) {
      console.error("Product updating product:", error);
      return { status: "error", error: error.message };
    }
  };
}

export { CartManager };

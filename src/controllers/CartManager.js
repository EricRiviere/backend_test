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
    let carts = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(carts);
  };

  writeCarts = async (carts) => {
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
  };

  addCart = async () => {
    let carts = await this.getCarts();
    let cId = nanoid(5);
    let newCart = {
      cartId: cId,
      products: [],
    };
    carts.push(newCart);
    await this.writeCarts(carts);
    return "New cart added.";
  };

  findCartById = async (id) => {
    let carts = await this.getCarts();
    let cart = carts.find((c) => c.cartId === id);
    return cart;
  };

  getCartById = async (id) => {
    let cart = await this.findCartById(id);
    if (!cart) return "Error: cart not found.";
    return cart;
  };

  addProductToCart = async (cId, pId) => {
    let carts = await this.getCarts();
    let cartFound = carts.find((c) => c.cartId === cId);
    if (!cartFound) return "Error: cart not found.";
    let productFound = await allProducts.findProductById(pId);
    if (!productFound) return "Error: product not found";
    let productOnCart = cartFound.products.find((p) => p.productId === pId);
    if (!productOnCart) {
      cartFound.products.push({
        productId: pId,
        amount: 1,
      });
      await this.writeCarts(carts);
      return "Product added to cart.";
    } else {
      productOnCart.amount++;
      await this.writeCarts(carts);
      return "Product ammount updated in cart.";
    }
  };
}

export { CartManager };

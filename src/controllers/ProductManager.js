import fs from "fs";
import { nanoid } from "nanoid";

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
    if (fs.existsSync(this.path)) {
      let products = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(products);
    } else {
      this.products = [];
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, "\t"));
    }
  }

  getProducts = async () => {
    try {
      let products = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      console.error("Error reading products file:", error);
      throw new Error("Error reading products file");
    }
  };

  writeProducts = async (products) => {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
    } catch (error) {
      console.error("Error writing products file:", error);
      throw new Error("Error writing products file");
    }
  };

  addProduct = async ({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
  }) => {
    try {
      if (
        !title ||
        !description ||
        !code ||
        !price ||
        !stock ||
        !category ||
        !thumbnails
      ) {
        throw new Error("Missing property");
      }
      let products = await this.getProducts();
      let existingProduct = products.find((product) => product.code === code);
      if (existingProduct) {
        throw new Error("Existing product with provided code");
      } else {
        let productId = nanoid(10);
        let newProduct = {
          id: productId,
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnails,
        };
        products.push(newProduct);
        await this.writeProducts(products);
        return {
          status: "success",
          message: "Product added to products list.",
        };
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
      return { status: "error", error: error.message };
    }
  };

  getProductById = async (id) => {
    try {
      let products = await this.getProducts();
      let product = products.find((product) => product.id === id);
      if (!product) {
        throw new Error("Product not found");
      }
      return {
        status: "success",
        product,
      };
    } catch (error) {
      console.error("Product not found:", error);
      return { status: "error", error: error.message };
    }
  };

  deleteProduct = async (id) => {
    try {
      let products = await this.getProducts();
      let product = await this.getProductById(id);
      if (product.status === "error") {
        throw new Error("Product not found");
      }
      let newProducts = products.filter((prod) => prod.id !== id);
      await this.writeProducts(newProducts);
      return {
        status: "success",
        message: "Product deleted from products list",
      };
    } catch (error) {
      console.error(error.message);
      return { status: "error", error: error.message };
    }
  };

  updateProduct = async (id, newProduct) => {
    try {
      let products = await this.getProducts();
      let product = await this.getProductById(id);
      if (product.status === "error") {
        throw new Error("Product not found");
      }
      let newProducts = products.filter((prod) => prod.id !== id);
      newProducts.push({ id, ...newProduct });
      await this.writeProducts(newProducts);
      return {
        status: "success",
        message: "Product updated in product list",
      };
    } catch (error) {
      console.error(error.message);
      return { status: "error", error: error.message };
    }
  };
}

export { ProductManager };

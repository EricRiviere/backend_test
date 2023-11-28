const formSocket = io();

const button = document.querySelector("#button");

formSocket.on("products_list", (data) => {
  console.log(data);

  const div = document.querySelector("#productsList");

  let productsGrid = "";

  data.forEach((product) => {
    productsGrid += `
        <div class="product-card">
        <img src="" alt="" class="product-image" />
        <h2 class="product-title">${product.title}</h2>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${product.price} $</p>
        <p>Stock: ${product.stock}</p>
        <p class="product-category">Category: ${product.category}</p>
        </div>
          `;
  });

  div.innerHTML = productsGrid;
});

button.addEventListener("click", (e) => {
  e.preventDefault();

  const title = document.querySelector("#product_title");
  const description = document.querySelector("#product_description");
  const price = document.querySelector("#product_price");
  const stock = document.querySelector("#product_stock");
  const category = document.querySelector("#product_category");

  const product = {
    title: title.value,
    description: description.value,
    price: price.value,
    stock: stock.value,
    category: category.value,
  };

  formSocket.emit("form_message", product);
});

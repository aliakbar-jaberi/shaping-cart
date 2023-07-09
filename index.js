const cartBtn = document.querySelector(".cart-btn");
const cart = document.querySelector(".cart");
const backdrop = document.querySelector(".backdrop");
const menuIcon = document.querySelector(".menu-icon");
const asaidMenu = document.querySelector(".aside-menu");
const poroductsDOM = document.querySelector(".products-center");
const cartIteme = document.querySelector(".cart__item");
const cartTotal = document.querySelector(".tota__price");
const cartContent = document.querySelector(".cart--content");
const clearCart = document.querySelector(".btn__removeall");

// Data recall
import { productsData } from "/deta.js";
let carts = [];
//  EVENT

cartBtn.addEventListener("click", openCart);
backdrop.addEventListener("click", closCart);
menuIcon.addEventListener("click", openMenu);
document.addEventListener("DOMContentLoaded", () => {
  // Construct an array of data
  const products = new Products();
  // Calling the data with the getProducts method of the Products class
  const productsData = products.getProducts();
  const ui = new Ui();
  // set up get cart and set up app
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
  // Save data on localStorage
  Storage.savePoroducts(productsData);
});

//  FUNCTION

// Open the shopping cart
function openCart() {
  cart.style.top = "50%";
  backdrop.style.display = "block";
}

// Close the shopping cart

function closCart() {
  cart.style.top = "-200%";
  backdrop.style.display = "none";
}

// Open the aside menu
function openMenu() {
  asaidMenu.classList.toggle("menu__active");
}

// CLASS

// get products
class Products {
  // Calling the data from the data.js file
  getProducts() {
    return productsData;
  }
}
// display products
class Ui {
  // Page builder method
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
            <div class="img-container">
              <img
                src=${item.imageUrl}
                class="product-img"
              />
            </div>
            <div class="product-desc">
              <p class="product-price">$ ${item.price}</p>
              <p class="product-title">${item.title}</p>
            </div>
            <div class="product-btn">
              <button  class="btn add-to-cart" data-id=${item.id}>
                <i class="fas fa-shopping-cart"></i>
                <p>add to cart</p>
              </button>
            </div>
          </div>`;

      poroductsDOM.innerHTML = result;
    });
  }
  getAddToCartBtns() {
    const addTocartBtn = document.querySelectorAll(".add-to-cart");
    const buttons = [...addTocartBtn];

    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      // check jf this product id is cart or not
      const isInCart = carts.find((p) => p.id === parseInt(id));
      const quntity = carts.filter((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerHTML = ` <div class="btn btn--content">
                <div class="btn--plus">+</div>
                <div class="product--value">${quntity[0].quntity}</div>
                <div class="btn--minus">-</div>
              </div> `;
        btn.style.padding = "0";
        btn.disabled = true;

        // Add new product to cart
      } else
        btn.addEventListener("click", (event) => {
          event.target.disabled = true;
          // get product from products
          const addedProduct = { ...Storage.getPoduct(id), quntity: 1 };
          // add to cart
          carts = [...carts, addedProduct];
          // save cart to local storage
          const quntity = carts.filter((p) => p.id === parseInt(id));
          event.target.innerHTML = `<div class="btn btn--content">
                <div class="btn--plus">+</div>
                <div class="product--value">${quntity[0].quntity}</div>
                <div class="btn--minus">-</div>
              </div>`;
          btn.style.padding = "0";
          Storage.saveCart(carts);
          // update cart value
          this.setCartValue(carts);
          // add to cart item
          this.addCartItem(addedProduct);
        });
    });
  }

  setCartValue(cart) {
    // cart items
    let tempCartItems = 0;
    // cart total price
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quntity;

      return acc + curr.quntity * curr.price;
    }, 0);

    cartIteme.innerText = tempCartItems;
    cartTotal.innerText = totalPrice;
  }
  addCartItem(cartItem) {
    const tr = document.createElement("tr");
    tr.classList.add("cart-item");
    tr.innerHTML = `<td >
            <div class="cart-img">
              <img
                src=${cartItem.imageUrl}
                alt="img-1"
              />
            </div>
          </td>
          <td class="cart-titel"><h4>${cartItem.title}</h4></td>
          <td><p>${cartItem.price}</p></td>
          <td>
            <div class="cart-namber">
              <span class="cart-plus"><i class="fas fa-chevron-up"></i></span>
              <input type="text" value="${cartItem.quntity}" />
              <span class="cart-minus">
                <i class="fas fa-chevron-down"></i
              ></span>
            </div>
          </td>
          <td><span><i class="fa-solid fa-trash-can"></i></span></td>`;
    cartContent.appendChild(tr);
  }

  setupApp() {
    // get cart fromt storeg
    carts = Storage.getCart() ;
    // add cart item
    carts.forEach((cartitem) => this.addCartItem(cartitem));
    // set values
    this.setCartValue(carts);
  }

  cartLogic() {
    clearCart.addEventListener("click", () => {
      carts.forEach((cItem) => this.removeItem(cItem.id));
    });
  }
  removeItem(id) {
    // update cart
    carts = carts.filter((cItem) => cItem.id !== id);
    this.setCartValue(carts);
    // update storage 
    Storage.saveCart(carts)
  }
}
// storage
class Storage {
  static savePoroducts(Products) {
    localStorage.setItem("poroducts", JSON.stringify(Products));
  }

  static getPoduct(id) {
    const _products = JSON.parse(localStorage.getItem("poroducts"));
    return _products.find((p) => p.id === parseInt(id));
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return JSON.parse(localStorage.getItem("cart"))
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

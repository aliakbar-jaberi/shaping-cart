// http://localhost:3000/items
const cartBtn = document.querySelector(".fa-cart-shopping");
const cart = document.querySelector(".cart");
const backdrop = document.querySelector(".backdrop");
const menuIcon = document.querySelector(".menu-icon");
const asaidMenu = document.querySelector(".aside-menu");
const poroductsDOM = document.querySelector(".products-center");
const cartIteme = document.querySelector(".cart__item");
const cartTotal = document.querySelector(".tota__price");
const cartContent = document.querySelector(".cart--content");
const clearCart = document.querySelector(".btn__removeall");
const filterBtn = document.querySelector(".fa-square-poll-vertical");
const filterProduct = document.querySelector(".filter");
const groupingBtn = document.querySelector(".grouping");
const searchInput = document.querySelector("#search");
const filterTag = document.querySelectorAll(".tag");
let buttonsDom = [];
let btnDOm = [];

// Data recall
import { productsData } from "/deta.js";
let carts = [];
let productsDatas = [];
let poroduct =[]

// axios
const app = axios.create({
  baseURL: "http://localhost:3000",
});
//  EVENT

cartBtn.addEventListener("click", openCart);
backdrop.addEventListener("click", closCart);
menuIcon.addEventListener("click", openMenu);
document.addEventListener("DOMContentLoaded", async () => {
  // Construct an array of data
  const products = new Products();
  // Calling the data with the getProducts method of the Products class
  const productsData = await products.getProducts();
  productsDatas = productsData;
  poroduct = productsData;
  const ui = new Ui();
  // set up get cart and set up app
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
  ui.filter();
  // Save data on localStorage
  Storage.savePoroducts(productsData);
});
filterBtn.addEventListener("click", openFilter);
groupingBtn.addEventListener("click", openFilter);
searchInput.addEventListener("input", (e) => {
  console.log("hi");
  const ui = new Ui();
  const filter = e.target.value;
  const poroducts = ui.serchFilter(productsDatas, filter);
  ui.displayProducts(poroducts);
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

function openFilter() {
  filterProduct.classList.toggle("filtir__active");
}

// CLASS

// get products
class Products {
  // Calling the data from the data.js file
  getProducts() {
    return productsData;
  }
  // async getProducts() {
  //   let productsData = [];
  //   try {
  //     const Data = await app.get("/items");
  //     productsData = Data.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   console.log(productsData);
  //   return productsData;
  // }
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
                src=${item.image}
                class="product-img"
              />
            </div>
            <div class="product-desc">
              <p class="product-price">$ ${item.price}</p>
              <p class="product-title">${item.title}</p>
            </div>
            <div class="product-btn" }>
              <button  class="btn add-to-cart" data-id=${item.id}>
                <i class="fas fa-shopping-cart"></i>
                <p>add to cart</p>
              </button>
            </div>
            <div class="product-btn" >
            <div class="btn btn--content" data-id=${item.id}>
                <div class="btn--plus" data-id=${item.id}>+</div>
                <div class="product--value" data-id=${item.id}>1</div>
                <div class="btn--minus" data-id=${item.id}>-</div>
              </div>
            </div>

          </div>`;

      poroductsDOM.innerHTML = result;
    });
  }

  getAddToCartBtns() {
    const addTocartBtn = document.querySelectorAll(".add-to-cart");
    const buttons = [...addTocartBtn];
    const btnContent = [...document.querySelectorAll(".btn--content")];
    const poroductValue = [...document.querySelectorAll(".product--value")];
    buttonsDom = buttons;
    btnDOm = btnContent;
    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      // check jf this product id is cart or not
      const isInCart = carts.find((p) => p.id === parseInt(id));
      const quntity = carts.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.style.display = "none";
        btnContent.forEach((btn) => {
          const i = btn.dataset.id;
          if (i == id) {
            btn.style.display = "flex";
          }
        });
        const value = poroductValue.find((p) => p.dataset.id == id);
        value.innerText = quntity.quntity;

        // Add new product to cart
      } else
        btn.addEventListener("click", () => {
          // get product from products
          const addedProduct = { ...Storage.getPoduct(id), quntity: 1 };
          // add to cart
          carts = [...carts, addedProduct];
          // save cart to local storage

          btn.style.display = "none";
          btnContent.forEach((btn) => {
            const i = btn.dataset.id;
            if (i == id) {
              btn.style.display = "flex";
            }
          });

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
    tr.dataset.id = cartItem.id;
    tr.classList = "cart-item";
    tr.classList.add("cart-item");
    tr.innerHTML = `<td  >
            <div class="cart-img">
              <img
                src=${cartItem.image}
                alt="img-1"
              />
            </div>
          </td>
          <td class="cart-titel"><h4>${cartItem.title}</h4></td>
          <td><p>${cartItem.price}</p></td>
          <td>
            <div class="cart-namber">
              <i class="fas fa-chevron-up" data-id="${cartItem.id}" ></i>
              <input class="cart-quntity" data-id="${cartItem.id}"  type="text" value="${cartItem.quntity}" />
              
                <i class="fas fa-chevron-down" data-id="${cartItem.id}"></i
              >
            </div>
          </td>
          <td><i class="fa-solid fa-trash-can"  data-id="${cartItem.id}"></i></td>`;
    cartContent.appendChild(tr);
  }

  setupApp() {
    // get cart fromt storeg
    carts = Storage.getCart();
    // add cart item
    carts.forEach((cartitem) => this.addCartItem(cartitem));
    // set values
    this.setCartValue(carts);
  }

  cartLogic() {
    clearCart.addEventListener("click", () => this.clearCart());
    // cart functionality
    cartContent.addEventListener("click", (event) => {
      this.eventCart(event);
    });
    btnDOm.forEach((b) => {
      b.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const item = carts.find((cItem) => cItem.id == id);
        const itemCart = [...document.querySelectorAll(".cart-item")];
        const cartQuantity = [...document.querySelectorAll(".cart-quntity")];
        const _cartQuantity = cartQuantity.find(
          (i) => i.dataset.id == e.target.dataset.id
        );

        if (e.target.classList.contains("btn--plus")) {
          const addQuantity = e.target;
          item.quntity++;
          Storage.saveCart(carts);
          this.setCartValue(carts);
          addQuantity.nextElementSibling.innerText = item.quntity;
          _cartQuantity.value = item.quntity;
        } else if (e.target.classList.contains("btn--minus")) {
          const subQuantity = e.target;
          if (item.quntity === 1) {
            const removeItem = itemCart.find(
              (i) => i.dataset.id == e.target.dataset.id
            );
            this.removeItem(item.id);
            Storage.saveCart(carts);
            this.setCartValue(carts);
            cartContent.removeChild(removeItem);
            return;
          }
          item.quntity--;
          Storage.saveCart(carts);
          this.setCartValue(carts);
          _cartQuantity.value = item.quntity;
          subQuantity.previousElementSibling.innerText = item.quntity;
        }
      });
    });
  }
  eventCart(event) {
    if (event.target.classList.contains("fa-chevron-up")) {
      const addQuantity = event.target;
      // get item from cart
      const addedItem = carts.find(
        (cItem) => cItem.id == addQuantity.dataset.id
      );
      addedItem.quntity++;
      // save cart value
      Storage.saveCart(carts);
      // update cart value
      this.setCartValue(carts);

      // update cart item in UI
      addQuantity.nextElementSibling.value = addedItem.quntity;
      const value = valueDOM.find((p) => p.dataset.id == addedItem.id);
      value.innerText = addedItem.quntity;
    } else if (event.target.classList.contains("fa-trash-can")) {
      // get item remove
      const removeItem = event.target;
      const _removedItem = carts.find((c) => c.id == removeItem.dataset.id);
      // remove from carts

      this.removeItem(_removedItem.id);
      //  remove in UI
      cartContent.removeChild(removeItem.parentElement.parentElement);
    } else if (event.target.classList.contains("fa-chevron-down")) {
      // get item
      const subQuantity = event.target;
      const subtractedItem = carts.find((c) => c.id == subQuantity.dataset.id);
      if (subtractedItem.quntity === 1) {
        this.removeItem(subtractedItem.id);
        cartContent.removeChild(
          subQuantity.parentElement.parentElement.parentElement
        );
        const value = valueDOM.find((p) => p.dataset.id == subtractedItem.id);
        value.innerText = subtractedItem.quntity;
        return;
      }
      // down from carts
      subtractedItem.quntity--;
      // save cart value
      Storage.saveCart(carts);
      // update cart value
      this.setCartValue(carts);

      // update cart item in UI
      subQuantity.previousElementSibling.value = subtractedItem.quntity;
      const value = valueDOM.find((p) => p.dataset.id == subtractedItem.id);
      value.innerText = subtractedItem.quntity;
    }
  }
  clearCart() {
    // remove
    carts.forEach((cItem) => this.removeItem(cItem.id));
    // remove cart content chidlren
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }

    closCart();
  }
  removeItem(id) {
    // update cart
    carts = carts.filter((cItem) => cItem.id !== id);
    this.setCartValue(carts);

    // update storage
    Storage.saveCart(carts);

    // get add to cart btns => update text and disables
    const button = buttonsDom.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    const btn = btnDOm.find((btn) => parseInt(btn.dataset.id) === parseInt(id));

    button.style.display = "flex";

    btn.style.display = "none";
  }

  serchFilter(product, filter) {
    const searchProduct = product.filter((p) => {
      return p.title.toLowerCase().includes(filter.toLowerCase());
    });
    if (!searchProduct.title) {
      poroductsDOM.innerHTML = `<div class="product-erorr"><i class="fa-solid fa-circle-exclamation"></i><h1>Product not found!</h1></div>`;
    }
    return searchProduct;
  }

  reset(){
    filterTag.forEach((t) => {
    t.style.backgroundColor = "var( --primaryColor)";
    t.style.color = "var( --mainWhite)";
  })}

  filter() {
    filterTag.forEach((t) => {
     
      
      t.addEventListener("click", () => {
        
        console.log(t.dataset.filter);
        const classTag = t.dataset.filter;
        const poroductFilter = productsData.filter((p) => {
          return p.class.toLowerCase().includes(classTag.toLowerCase());
        });
        productsDatas=poroductFilter
        const ui = new Ui();
        ui.displayProducts(poroductFilter);
        ui.reset();
        t.style.backgroundColor = "var( --mainWhite)";
        t.style.color = "var( --primaryColor)";
      });
    });
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

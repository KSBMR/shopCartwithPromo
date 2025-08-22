// ============  all Query selector

let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.list-product');
let cartToHTML = document.querySelector('.listcart')
let iconcartSpan = document.querySelector('.icon-cart span')


let gridBtn = document.querySelector('.grid-btn');
let listBtn = document.querySelector('.list-btn');

let cartTotalElem = document.querySelector('.cart-total .total-amount')


let listProducts = []
let cartList = []

//==========      Cart list show ===============

iconCart.addEventListener('click', () => {
  body.classList.toggle('showcart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showcart');
})


console.log(body.classList);

//===========    Products Module   ==================

const addToHTML = () => {
    listProductHTML.innerHTML = '';
    if(listProducts.length > 0) {
        listProducts.forEach(product => {
            let newproduct = document.createElement('div');
            newproduct.classList.add('item')
            newproduct.dataset.id = product.id 
            newproduct.innerHTML=`
                <img src="${product.image}" alt="">
                <h2 class="text-2xl font-bold text-[#333] text-center mt-2.5">${product.name}</h2>
                <p class="text-gray-700 text-[15px] leading-relaxed mt-2" id="description">${product.description}</p>
                <div class="text-[17px] font-bold mt-1.5 ">$${product.price}</div>
                <button class="add-to-cart">Add to Cart</button>
            `;
            listProductHTML.appendChild(newproduct);      
        })
    }
}
//==================  Add to Cart button ==================

listProductHTML.addEventListener('click', (event) =>{
    let positionClicker = event.target;
    if(positionClicker.classList.contains('add-to-cart')){
        let product_id = positionClicker.parentElement.dataset.id;
        addToCart(product_id)
    }
})

const addToCart = (product_id) => {
    let positionontheproductcart = cartList.findIndex((value) => value.product_id == product_id)
    if(cartList.length <= 0){
        cartList = [{
            product_id: product_id,
            quantity: 1
        }]
    } else if (positionontheproductcart < 0){
        cartList.push({
            product_id: product_id,
            quantity:1
        })
        } else{
            cartList[positionontheproductcart].quantity = cartList[positionontheproductcart].quantity +1
        }
    AddCartToHTML()
    AddCartToMamory()
}

//========== local storage mamory =======================

const AddCartToMamory = () => {
    localStorage.setItem('cart', JSON.stringify(cartList));
}

//============   Product Added in Cart module ================

const AddCartToHTML = () =>{
    cartToHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if(cartList.length > 0 ){
        cartList.forEach( cart =>{
            let newCartList = document.createElement('div');

            totalQuantity = totalQuantity + cart.quantity;

            newCartList.classList.add('item');

            newCartList.dataset.id = cart.product_id;

            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id)
            let info = listProducts[positionProduct]

            totalPrice += (Number(info.price) || 0) * cart.quantity;


            newCartList.innerHTML=`
            <div class="image">
                  <img src="${info.image}" alt="Product Image">
              </div>
              <div class="name">${info.name}</div>
              <div class="totalprice">
                $${info.price * cart.quantity}
              </div>

              <div class="quantity">
                <span class="minus"><</span>
                <span>${cart.quantity}</span>
                <span class="plus">></span>
              </div>
            `;
            cartToHTML.appendChild(newCartList);
        } )
    }
    iconcartSpan.innerHTML = totalQuantity;

     if(cartTotalElem){
      cartTotalElem.textContent = '$' + totalPrice.toFixed(2);
    }

}

//================     Product Quantity ===============

cartToHTML.addEventListener('click', (event) => {
    let posotionClick = event.target;
    if(posotionClick.classList.contains('minus') || posotionClick.classList.contains('plus')) {
        let product_id = posotionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (posotionClick.classList.contains('plus')){
            type = 'plus'
        }
        changeQuantity(product_id, type)
    }
})

const changeQuantity = (product_id, type) => {
        let positionItemInCart = cartList.findIndex((value) => value.product_id == product_id);
        if(positionItemInCart >= 0) {
            switch(type){
                case 'plus':
                    cartList[positionItemInCart].quantity = cartList[positionItemInCart].quantity+1 
                    break;
                default:
                    let valuChange =  cartList[positionItemInCart].quantity -1
                    if(valuChange > 0) {
                        cartList[positionItemInCart].quantity = valuChange
                    }else{
                        cartList.splice(positionItemInCart,1);
                    }  
                    break;      
            }
            AddCartToMamory();
            AddCartToHTML()
        }
}

//===============   list and grid  ===============   ////////


const applyView = (mode) => {
  if(mode === 'list'){
    listProductHTML.classList.add('list-mode');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
  } else {
    listProductHTML.classList.remove('list-mode');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
  }
  localStorage.setItem('productView', mode);
};

gridBtn.addEventListener('click', () => applyView('grid'));
listBtn.addEventListener('click', () => applyView('list'));


const initView = () => {
  const saved = localStorage.getItem('productView') || 'grid';
  applyView(saved);
};



//=============  improt Product details from JSON file ==========

const init = () => {
    fetch('product.json')
    .then( response => response.json())
    .then(data => {
        listProducts = data
        // console.log(listProducts);
        addToHTML();

        if(localStorage.getItem('cart')) {
            cartList = JSON.parse(localStorage.getItem('cart'));
            AddCartToHTML()
        }
    })
}
init()


let promoCodeInput = document.querySelector('#promoCodeInput');
let applyPromoCodeBtn = document.querySelector('#applyPromoCode');
let totalPriceElement = document.querySelector('#cartTotal'); 


const calculateTotalPrice = () => {
    let totalPrice = 0;

    cartList.forEach(cart => {
        let positionProduct = listProducts.findIndex(value => value.id == cart.product_id);
        let info = listProducts[positionProduct];
        totalPrice += (Number(info.price) || 0) * cart.quantity;
    });

    return totalPrice;
};


const applyPromoCode = () => {
    const promoCode = promoCodeInput.value.trim(); 
    const totalPrice = calculateTotalPrice(); 

    let discountedTotal = totalPrice; 

    
    if (promoCode === 'ostad10') {
        discountedTotal = totalPrice * 0.9; 
    } else if (promoCode === 'ostad50') {
        discountedTotal = totalPrice * 0.5; 
    } else {
        alert('Invalid promo code!'); 
        return;
    }

    
    totalPriceElement.textContent = '$' + discountedTotal.toFixed(2);
};



applyPromoCodeBtn.addEventListener('click', applyPromoCode);

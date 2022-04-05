let totalQuantity = 0;
let totalPrice = 0;

getProductsFromCart();
addEventOrder();


/** Get List of products from storage */
function getProductsFromCart() {

    const storage = getStorageByName('ProductStorage');

    for (let prd of storage) {
        getProduct(prd);
    }
    showTotalCart();

}

/** Get one product detail from API */
function getProduct(prdStorage) {
    const apiURL = "http://localhost:3000/api/products/";

    fetch(apiURL + prdStorage.id)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(prdApi) {
                        showProduct(prdApi, prdStorage);
                    })
                    .then(addEventListener);
            }
        })
        .catch(function(err) {
            console.error('Une erreur est survenue', err);
        });
}
/** show products detail to pageweb */
function showProduct(prdApi, prdStorage) {

    const element = document.createElement('article');
    element.className = "cart__item";
    element.setAttribute('data-id', prdStorage.id);
    element.setAttribute('data-color', prdStorage.color);
    element.innerHTML = `
    <div class="cart__item__img">
        <img src="${prdApi.imageUrl}" alt="${prdApi.altTxt}">
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${prdApi.name}</h2>
            <p>${prdStorage.color}</p>
            <p>${prdApi.price} €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${prdStorage.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
        </div>
    </div>`;

    document.getElementById('cart__items').appendChild(element);
}

/** Calculat Total: quantity & Price */
function showTotalCart() {
    const apiURL = "http://localhost:3000/api/products/";

    const storage = getStorageByName('ProductStorage');
    let qnt = 0;
    let price = 0;

    for (let prdStorage of storage) {
        fetch(apiURL + prdStorage.id)
            .then(function(response) {
                if (response.ok) {
                    response.json().then(function(prdApi) {
                        qnt += Number(prdStorage.quantity);
                        price += (Number(prdStorage.quantity) * Number(prdApi.price))
                        document.getElementById('totalQuantity').innerHTML = qnt;
                        document.getElementById('totalPrice').innerHTML = price;
                    });
                }
            })
            .catch(function(err) {
                console.error('Une erreur est survenue', err);
            });



    }

}

/** Add eventListner to Remove product and Quantity */
function addEventListener() {
    var deleteItem = document.getElementsByClassName("deleteItem");
    for (var i = 0; i < deleteItem.length; i++) {
        deleteItem[i].addEventListener('click', removeProduct, false);
    }

    var itemQuantity = document.getElementsByClassName("itemQuantity");
    for (var i = 0; i < itemQuantity.length; i++) {
        itemQuantity[i].addEventListener('change', updateQuantity, false);
    }


}
/** Remove product */
var removeProduct = function() {

    const storage = getStorageByName('ProductStorage');

    var article = this.closest("article");
    var id = article.dataset.id;
    var color = article.dataset.color;

    // Remove product from storage
    for (var i = 0; i < storage.length; i++) {

        if (storage[i].id == id && storage[i].color == color) {
            storage.splice(i, 1);
        }
    }
    localStorage.setItem('ProductStorage', JSON.stringify(storage));

    // Remove product from webpage
    article.remove();
    showTotalCart();
};
/** Update product quntity */
var updateQuantity = function() {

    const storage = getStorageByName('ProductStorage');

    var article = this.closest("article");
    var id = article.dataset.id;
    var color = article.dataset.color;

    // update product from storage
    for (var i = 0; i < storage.length; i++) {

        if (storage[i].id == id && storage[i].color == color) {
            storage[i].quantity = this.value;
        }
    }
    localStorage.setItem('ProductStorage', JSON.stringify(storage));
    showTotalCart();
}

function validationForm() {
    var isItValid = true;
    var firstName = document.getElementById("firstName");
    var lastName = document.getElementById("lastName");
    var email = document.getElementById("email");
    var address = document.getElementById("address");

    if (firstName.validity.valueMissing) {
        isItValid = false;
    }
    if (email.validity.valueMissing) {
        isItValid = false;
    }
    return isItValid;
}


function addEventOrder() {
    document.getElementById("order").addEventListener("click", orderCommand);
}

function orderCommand() {
    if (validationForm()) {
        alert('order now');
    }

}
/** Get storage by Name */
function getStorageByName(name) {
    return JSON.parse(localStorage.getItem(name));
}
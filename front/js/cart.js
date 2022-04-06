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
    if (getStorageByName('ProductStorage').length == 0) {
        document.getElementById('totalQuantity').innerHTML = qnt;
        document.getElementById('totalPrice').innerHTML = price;
        document.getElementById("order").setAttribute("disabled", "disabled");

    } else {
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
    console.log(this);
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

function removeQuantityNull(article) {
    const storage = getStorageByName('ProductStorage');
    console.log(this);

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
}


/** Update product quntity */
var updateQuantity = function() {
    console.log(this);
    const storage = getStorageByName('ProductStorage');

    var article = this.closest("article");
    var id = article.dataset.id;
    var color = article.dataset.color;
    //verifier si la quantité = 0

    if (this.value == 0) {
        removeQuantityNull(article);
        return
    }


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
    var city = document.getElementById("city");

    if (firstName.validity.valueMissing) {
        isItValid = false;
    } else {
        if (/[A-Za-z\. -]+/.test(firstName.value) == false) {
            isItValid = false;
            document.getElementById("firstNameErrorMsg").innerText = "Votre nom n'est pas valide";
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
        }

    }

    if (lastName.validity.valueMissing) {
        isItValid = false;
    } else {
        if (/[A-Za-z\. -]+/.test(lastName.value) == false) {
            isItValid = false;
            document.getElementById("lastNameErrorMsg").innerText = "Votre prenom n'est pas valide";
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
        }
    }
    if (email.validity.valueMissing) {
        isItValid = false;
    } else {
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value) == false) {
            isItValid = false;
            document.getElementById("emailErrorMsg").innerText = "Votre email n'est pas valide";
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
        }
    }
    if (address.validity.valueMissing) {
        isItValid = false;
    } else {
        if (/^\s*\S+(?:\s+\S+){2}/.test(address.value) == false) {
            isItValid = false;
            document.getElementById("addressErrorMsg").innerText = "Votre adresse n'est pas valide";
        } else {
            document.getElementById("addressErrorMsg").innerText = "";
        }
    }
    if (city.validity.valueMissing) {
        isItValid = false;
    } else {
        if (/[a-zA-Z -]+/.test(city.value) == false) {
            isItValid = false;
            document.getElementById("cityErrorMsg").innerText = "Votre ville n'est pas valide";
        } else {
            document.getElementById("cityErrorMsg").innerText = "";
        }
    }
    return isItValid;
}


function addEventOrder() {
    document.getElementById("order").addEventListener("click", orderCommand);
}

function orderCommand(e) {

    if (validationForm()) {

        alert('order now');
    } else {
        e.preventDefault();
    }

}
/** Get storage by Name */
function getStorageByName(name) {
    return JSON.parse(localStorage.getItem(name));
}
getProductsFromCart();

/** Get List of products from storage and calculate total price & quantity of cart*/
function getProductsFromCart() {
    const storage = getStorageByName('ProductStorage');
    if (storage) {
        for (let prd of storage) {
            getProduct(prd);
        }
        calculateTotalCart();
    } else {
        // alert("Votre panier est vide");
        showError("Votre panier est vide!");
        document.getElementById("cart__items").textContent = "Votre panier est vide!";
        document.getElementById("order").setAttribute("disabled", "disabled");
    }
}
/**
 * Get one product detail form API
 * @param   {object}   prdStorage          Product info on storage
 * @param   {string}   prdStorage.id       Product id
 * @param   {string}   prdStorage.color    Product color
 * @param   {number}   prdStorage.quantity Product quantity
 */
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
            } else {
                showError(response);
            }
        })
        .catch(function(err) {
            showError(err);
        });
}
/**
 * show products detail to pageweb
 * @param {Object}             prdApi                  Product item from API
 * @param   {string}           prdApi._id              Product id
 * @param   {string}           prdApi.name             Product name
 * @param   {string}           prdApi.price            Product price
 * @param   {string}           prdApi.imageUrl         Product imageUrl
 * @param   {string}           prdApi.description      Product description
 * @param   {string}           prdApi.altTxt           Product altTxt
 * @param   {Array.<String>}   prdApi.colors           Product colors
 * @param {Object}      prdStorage                     Product item from storage 
 * @param   {string}   prdStorage.id       Product id
 * @param   {string}   prdStorage.color    Product color
 * @param   {number}   prdStorage.quantity Product quantity
 */
function showProduct(prdApi, prdStorage) {

    const element = document.createElement('article');
    element.setAttribute("class", "cart__item");
    element.setAttribute('data-id', prdStorage.id);
    element.setAttribute('data-color', prdStorage.color);


    let div_item__img = document.createElement("div");
    div_item__img.setAttribute("class", "cart__item__img");

    let img = document.createElement("img");
    img.setAttribute("src", prdApi.imageUrl);
    img.setAttribute("alt", prdApi.altTxt);
    div_item__img.append(img);


    let div_item__content = document.createElement("div");
    div_item__content.setAttribute("class", "cart__item__content");

    let div_item__description = document.createElement("div");
    div_item__description.setAttribute("class", "cart__item__content__description");
    let hName = document.createElement("h2");
    hName.textContent = prdApi.name;
    let pColor = document.createElement("p");
    pColor.textContent = prdStorage.color;
    let pPrice = document.createElement("p");
    pPrice.textContent = prdApi.price + " €";

    div_item__description.append(hName, pColor, pPrice);

    let div_item__settings = document.createElement("div");
    div_item__settings.setAttribute("class", "cart__item__content__settings");

    let div_item__quantity = document.createElement("div");
    div_item__quantity.setAttribute("class", "cart__item__content__settings__quantity");

    let qte = document.createElement("p");
    qte.textContent = "Qté :";
    let input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("class", "itemQuantity");
    input.setAttribute("name", "itemQuantity");
    input.setAttribute("min", "1");
    input.setAttribute("max", "100");
    input.setAttribute("value", prdStorage.quantity);

    div_item__quantity.append(qte, input);

    let div_item__delete = document.createElement("div");
    div_item__delete.setAttribute("class", "cart__item__content__settings__delete");
    let pDelete = document.createElement("p");
    pDelete.setAttribute("class", "deleteItem");
    pDelete.textContent = "Supprimer";

    div_item__delete.append(pDelete);

    div_item__settings.append(div_item__quantity, div_item__delete);

    div_item__content.append(div_item__description, div_item__settings);

    element.append(div_item__img, div_item__content);

    document.getElementById('cart__items').appendChild(element);
}

/** Calculat Total: quantity & Price */
function calculateTotalCart() {
    const apiURL = "http://localhost:3000/api/products/";

    const storage = getStorageByName('ProductStorage');
    let qnt = 0;
    let price = 0;
    if (storage.length == 0) {
        document.getElementById('totalQuantity').textContent = qnt;
        document.getElementById('totalPrice').textContent = price;
        document.getElementById("order").setAttribute("disabled", "disabled");

    } else {
        for (let prdStorage of storage) {
            fetch(apiURL + prdStorage.id)
                .then(function(response) {
                    if (response.ok) {
                        response.json().then(function(prdApi) {
                            qnt += Number(prdStorage.quantity);
                            price += (Number(prdStorage.quantity) * Number(prdApi.price))
                            document.getElementById('totalQuantity').textContent = qnt;
                            document.getElementById('totalPrice').textContent = price;
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
        itemQuantity[i].addEventListener('blur', function() {
            if (this.value < 1 || this.value > 100) {
                this.focus();
            }
        }, false);
    }
}
/** Remove product from cart*/
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
    calculateTotalCart();
};
/**
 * remove product from cart and webpage
 * @param {HTMLCollection} article  article element
 */
function removeQuantityNull(article) {
    const storage = getStorageByName('ProductStorage');

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
    calculateTotalCart();
}
/** Update product quntity on cart*/
var updateQuantity = function() {
    console.log(this.value);
    var storage = getStorageByName('ProductStorage');
    var article = this.closest("article");
    var id = article.dataset.id;
    var color = article.dataset.color;
    //verifier si la quantité = 0
    if (this.value == 0) {
        removeQuantityNull(article);
    } else if (this.value < 1 || this.value > 100) {
        alert("veuillez choisir une quantitée entre 1 et 100");
    } else {
        // update product from storage
        for (var element of storage) {

            if (element.id == id && element.color == color) {
                element.quantity = this.value;
            }
        }
        localStorage.setItem('ProductStorage', JSON.stringify(storage));
        calculateTotalCart();
    }
};
/**
 * return true|false if inputs form are valid
 * @returns boolen
 */
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
        if (/^[A-Za-z -]+$/.test(firstName.value) == false) {
            isItValid = false;
            document.getElementById("firstNameErrorMsg").textContent = "Votre nom n'est pas valide";
        } else {
            document.getElementById("firstNameErrorMsg").textContent = "";
        }

    }
    if (lastName.validity.valueMissing) {
        isItValid = false;
    } else {
        if (/^[A-Za-z -]+$/.test(lastName.value) == false) {
            isItValid = false;
            document.getElementById("lastNameErrorMsg").textContent = "Votre prenom n'est pas valide";
        } else {
            document.getElementById("lastNameErrorMsg").textContent = "";
        }
    }
    if (email.validity.valueMissing) {
        isItValid = false;
    } else {
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value) == false) {
            isItValid = false;
            document.getElementById("emailErrorMsg").textContent = "Votre email n'est pas valide";
        } else {
            document.getElementById("emailErrorMsg").textContent = "";
        }
    }
    if (address.validity.valueMissing) {
        isItValid = false;
    } else {
        if (/[^A-Za-z0-9]+/.test(address.value) == false) {
            isItValid = false;
            document.getElementById("addressErrorMsg").textContent = "Votre adresse n'est pas valide";
        } else {
            document.getElementById("addressErrorMsg").textContent = "";
        }
    }
    if (city.validity.valueMissing) {
        isItValid = false;
    } else {
        if (/^[A-Za-z -]+$/.test(city.value) == false) {
            isItValid = false;
            document.getElementById("cityErrorMsg").textContent = "Votre ville n'est pas valide";
        } else {
            document.getElementById("cityErrorMsg").textContent = "";
        }
    }
    return isItValid;
}
addEventOrder();
/**
 * Function to attach event
 */
function addEventOrder() {
    document.getElementById("order").addEventListener("click", orderCommand, false);
}
/**
 * 
 * @param {event} e event
 */
function orderCommand(e) {
    if (validationForm() && document.forms[0].reportValidity()) {
        if (confirm("Voulez vous confirmer votre commande?")) {
            addContactToOrder();
        }
    }
    e.preventDefault();
    document.forms[0].reportValidity(); //pour valider les données required et activer le message veuillez saisir....
}
/**
 * the function call API using post to generate Order and redirect to confirmation page
 */
function addContactToOrder() {
    const apiURL = "http://localhost:3000/api/products/order";
    var storage = getStorageByName('ProductStorage');

    const order = {
        contact: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('email').value,
            city: document.getElementById('address').value,
            email: document.getElementById('city').value
        },
        products: storage.map(x => x.id),
    };
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    };


    fetch(apiURL, requestOptions)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(resp) {
                    if (resp.orderId) {
                        localStorage.removeItem('ProductStorage');
                        window.location = "confirmation.html?orderid=" + resp.orderId;
                    }
                });
            } else {
                showError(response);
            }
        })
        .catch(function(err) {
            showError(err);
        });


}
/**
 * get object from storage
 * @param {string} name Storage key name
 * @returns object
 */
function getStorageByName(name) {
    return JSON.parse(localStorage.getItem(name));
}
/**
 * Show message error
 * @param {object} msg object or string message error to show on the console
 */
function showError(msg) {
    const item = document.getElementById("cart__items");
    console.error('Une erreur est survenue, ', msg);
    item.textContent = "Une erreur est survenue, nous n'avons pas pu traiter votre commande. Veuillez nous excusez";
    item.style.color = "#3d424f";
    item.style.backgroundColor = "white";
    item.style.textAlign = "#center";
    item.style.fontWeight = "500";
    item.style.padding = "30px";
    item.style.borderRadius = "25px";
}
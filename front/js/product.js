getProduct();

/** 
 * Get param id from URL
 * @return { string }   string
 * */
function getUrlParam() {
    var str = window.location.href; // get current url: http://localhost:5501/front/html/product.html?id=107fb5b75607497b96722bda5b504926
    var url = new URL(str);
    if (url.searchParams.get("id")) {
        return url.searchParams.get("id"); // 107fb5b75607497b96722bda5b504926
    } else {
        return null;
    }
}

/** Get one product detail from API */
function getProduct() {
    const apiURL = "http://localhost:3000/api/products/";
    const id = getUrlParam();
    if (id) {
        fetch(apiURL + id)
            .then(function(response) {
                if (response.ok) {
                    response.json().then(showProduct);
                } else {
                    showError(response);
                }
            })
            .catch(function(err) {
                showError(err);
            });
    } else {
        showError("url param not found");
    }
}
/** 
 * show products detail to pageweb 
 * @param   {Object}   product                  Product item
 * @param   {string}   product._id              Product id
 * @param   {string}   product.name             Product name
 * @param   {string}   product.price            Product price
 * @param   {string}   product.imageUrl         Product imageUrl
 * @param   {string}   product.description      Product description
 * @param   {string}   product.altTxt           Product altTxt
 * @param   {Array.<String>}   product.colors   Product colors
 */
function showProduct(product) {

    const img = document.createElement("img");
    img.setAttribute("src", product.imageUrl);
    img.setAttribute("alt", product.altTxt);

    document.getElementsByClassName("item__img")[0].append(img);

    document.getElementById("title").textContent = product.name;
    document.getElementById("price").textContent = product.price;
    document.getElementById("description").textContent = product.description;



    for (let color of product.colors) {

        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        document.getElementById("colors").append(option);
    }
}
/** call event Click */
addEvent();
/**
 * Function to attach event
 */
function addEvent() {
    document
        .getElementById("addToCart")
        .addEventListener("click", checkInputs);
    document
        .getElementById("quantity")
        .addEventListener("change", function(e) {
            if (e.target.value < 0 || e.target.value > 100) {
                alert("Nombre d'article doit être compris entre 1 et 100");
            }
        });
}

/** check if fields are ok and add product to cart*/
function checkInputs() {
    const id = getUrlParam();
    const color = document.getElementById("colors").value;
    const quantity = document.getElementById("quantity").value;

    if (color == "") {
        alert("veuillez choisir une couleur");
        return;
    }
    if (Number(quantity) < 1 || Number(quantity) > 100) {
        alert("veuillez choisir une quantitée entre 1 et 100");
        return;
    }

    addToCart(id, color, quantity);

}

/**
 * update cart with product (Add new product if not exist. Update quantity of existing product)
 * @param {string} id       product id
 * @param {string} color    product color
 * @param {number} quantity product quantity to order
 */
function addToCart(id, color, quantity) {
    const storage = getStorageByName('ProductStorage');
    // 1 vérififier si :
    // 1-1 : un prdt existe ID deja avec la meme couleur
    // --> augmenter quantite du produit
    // sinon:
    // 1-2 : on ajoute un autre produit

    if (storage) {
        const existprd = existProduct(id, color);
        if (existprd) {
            updateQuantity(id, color, quantity);
        } else {
            addProcuct(id, color, quantity);
        }
    } else {
        createStorage();
        addProcuct(id, color, quantity);
    }
}
/**
 * return if the same prdt id with the same color exist
 * @param {string} id       product id
 * @param {string} color    product color
 * @returns boolean
 */ // i need to search on storage and check if existing product with the same id and color exist
// then : return true;
// else: return false
function existProduct(id, color) {
    const storage = JSON.parse(localStorage.getItem('ProductStorage'));
    for (let prd of storage) {
        if (prd.id == id && prd.color == color) {
            return true;
        }
    }
    return false;
}

/**
 * update product quantity for existing product on cart
 * @param {string} id       product id
 * @param {string} color    product color
 * @param {number} quantity product quantity to add
 */
function updateQuantity(id, color, quantity) {
    // i need to update storage quantity for a product by id and color
    const storage = getStorageByName('ProductStorage');

    for (let prd of storage) {
        if (prd.id == id && prd.color == color) {
            prd.quantity += Number(quantity);
        }
    }
    localStorage.setItem('ProductStorage', JSON.stringify(storage));
    alert("Nous avons mis à jours votre panier");
}

/**
 * add new product to cart
 * @param {string} id       product id
 * @param {string} color    product color
 * @param {number} quantity product quantity
 */
function addProcuct(id, color, quantity) {
    // if storage not exist, then
    // --> createStorage()
    // else 
    // add new product to storage

    const storage = getStorageByName('ProductStorage');

    let newproduct = {
        id: id,
        color: color,
        quantity: Number(quantity)
    };
    storage.push(newproduct);

    localStorage.setItem('ProductStorage', JSON.stringify(storage));
    alert("Nous avons ajouter le produit dans votre panier");

}

/** Create storage if not exist to store cart details */
function createStorage() {
    let newproduct = [];
    localStorage.setItem('ProductStorage', JSON.stringify(newproduct));
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
    const item = document.getElementsByClassName("item")[0];
    console.error('Une erreur est survenue', msg);
    item.textContent = "";
    var link = document.createElement("a")
    link.setAttribute("href", "index.html");
    link.textContent = " ici ";
    var span1 = document.createElement("span");
    span1.textContent = "Nous n'avons pas pu trouver le produit demandé. Cliquez \u00A0 ";
    var span2 = document.createElement("span");
    span2.textContent = "\u00A0 pour revenir à la liste des produits";

    item.append(span1, link, span2);

    item.style.color = "#3d424f";
    item.style.backgroundColor = "white";
    item.style.textAlign = "#center";
    item.style.fontWeight = "500";
    item.style.padding = "30px";
    item.style.borderRadius = "25px";
}
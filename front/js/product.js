/** Constant with URL of the API to fetch for products */
const apiURL = "http://localhost:3000/api/products/";


getProduct();


/** return param id from URL */
function getUrlParam() {
    var str = window.location.href; // get current url: http://localhost:5501/front/html/product.html?id=107fb5b75607497b96722bda5b504926
    var url = new URL(str);
    return url.searchParams.get("id"); // 107fb5b75607497b96722bda5b504926
}

/** Get one product detail from API */
function getProduct() {

    fetch(apiURL + getUrlParam())
        .then(function(response) {
            if (response.ok) {
                response.json().then(showProduct);
            }
        })
        .catch(function(err) {
            console.error('Une erreur est survenue', err);
        });
}
/** show products detail to pageweb */
function showProduct(product) {



    document.getElementsByClassName("item__img")[0].innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

    document.getElementById("title").innerHTML = product.name;
    document.getElementById("price").innerHTML = product.price;
    document.getElementById("description").innerHTML = product.description;

    const select = document.getElementById("colors");

    for (let color of product.colors) {

        const option = document.createElement("option");
        option.value = color;
        option.innerHTML = color;

        select.appendChild(option);
    }
}

document
    .getElementById("addToCart")
    .addEventListener("click", addToCart);

function addToCart() {

    const id = getUrlParam();
    const color = document.getElementById("colors").value
    const quantity = document.getElementById("quantity").value

    // 1 vérififier si :
    // 1-1 : un prdt existe ID deja avec la meme couleur
    // --> augmenter quantite du produit
    // sinon:
    // 1-2 : on ajoute un autre produit

    if (existProduct(id, color)) {
        updateQuantity(id, color, quantity);
    } else {
        addProcuct(id, color, quantity);
    }


}
/** return if the same prdt id with the same color exist */
function existProduct(id, color) {
    // i need to search on storage and check if existing product with the same id and color exist
    // then : return true;
    // else: return false
}

/** update quantity value fro existing product */
function updateQuantity(id, color, quantity) {
    // i need to update storage quantity for a product by id and color
}

/** add new product */
function addProcuct(id, color, quantity) {
    // if storage not exist, then
    // --> createStorage()
    // else 
    // add new product to storage
}

/** Create storage if not exist */
function createStorage() {

}
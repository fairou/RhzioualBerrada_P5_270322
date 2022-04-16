getAllProducts();

/** Get list of all product from API */
function getAllProducts() {
    const apiURL = "http://localhost:3000/api/products/";
    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(addProducts);
            } else {
                showError(response);
            }
        })
        .catch(function(err) {
            showError(err);
        });
}
/**
 * Add Products to pageweb 
 * @param   {Object[]}   products                Products item
 * @param   {string}   products._id              Product id
 * @param   {string}   products.name             Product name
 * @param   {string}   products.price            Product price
 * @param   {string}   products.imageUrl         Product imageUrl
 * @param   {string}   products.description      Product description
 * @param   {string}   products.altTxt           Product altTxt
 * @param   {Array.<String>}   products.colors   Product colors
 */
function addProducts(products) {
    for (let product of products) {

        let a = document.createElement('a');
        a.setAttribute("href", `./product.html?id=${product._id}`);

        let article = document.createElement("article");
        let img = document.createElement("img");
        img.setAttribute("src", product.imageUrl);
        img.setAttribute("alt", product.altTxt);

        let h3 = document.createElement("h3");
        h3.setAttribute("class", "productName");
        h3.textContent = product.name;

        let p = document.createElement("p");
        p.setAttribute("class", "productDescription");
        p.textContent = product.description;

        article.append(img, h3, p);

        a.append(article);

        document.getElementById("items").append(a);

    }
}

function showError(err) {
    console.error('Une erreur est survenue', msg);
    document.getElementById("items").textContent = "Une erreur est survenue. Veuillez nous excusez";
    document.getElementById("items").style.color = "#3d424f";
    document.getElementById("items").style.backgroundColor = "white";
    document.getElementById("items").style.textAlign = "#center";
    document.getElementById("items").style.fontWeight = "500";
    document.getElementById("items").style.padding = "30px";
    document.getElementById("items").style.borderRadius = "25px";
}
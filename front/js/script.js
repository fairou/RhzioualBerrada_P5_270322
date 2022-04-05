/** Constant with URL of the API to fetch for products */


/** Get list of all product from API */
function getAllProducts() {
    const apiURL = "http://localhost:3000/api/products/";
    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(addProducts);
            }
        })
        .catch(function(err) {
            console.error('Une erreur est survenue', err);
        });
}
/** Add products to pageweb */
function addProducts(products) {
    for (let product of products) {

        const element = document.createElement('a');
        element.href = `./product.html?id=${product._id}`;
        element.innerHTML = `<article>
                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                        <h3 class="productName">${product.name}</h3>
                        <p class="productDescription">${product.description}</p>
                        </article>
                        `;

        document.getElementById('items').appendChild(element);




    }
}

getAllProducts();
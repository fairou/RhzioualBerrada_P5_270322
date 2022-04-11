confirmOrder();

/** 
 * Get param id from URL 
 * @return { string }   string
 * */
function getUrlParam() {
    var str = window.location.href;
    var url = new URL(str);

    if (url.searchParams.get("orderid")) {
        return url.searchParams.get("orderid");
    } else {
        return null;
    }
}

/**
 * Show order id on webpage
 */
function confirmOrder() {
    const id = getUrlParam();
    if (id) {
        document.getElementById("orderId").innerHTML = getUrlParam();
    } else {

        document.getElementsByClassName("confirmation")[0].innerHTML = "<p>Aucune commande n'a été effectué</p>";
        console.error("url param not found");
    }
}
// Affichage de la page de confirmation de commande

const orderId = getOrderId();

// Création des fonctions de récupération d'ID de commande et d'affichage

function getOrderId(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("orderId");
};

function displayOrderId(){
    const orderIdElement = document.getElementById("orderId");
    orderIdElement.textContent = orderId;
};

// Création de fonction de nettoyage du local storage après la commande

function cleanAllStorage(){
    const cache = window.localStorage;
    cache.clear();
};

displayOrderId(orderId);
cleanAllStorage();
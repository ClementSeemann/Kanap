// Affichage de la page panier avec modification et suppression des commandes
// Définition des constantes

const cart = [];
const orderButton = document.querySelector("#order");


// Récupération des éléments du Local Storage
function retrieveItemsFromStorage(){
    const numberOfItems = localStorage.length;
    for (let i = 0; i< numberOfItems; i++){
        const item = localStorage.getItem(localStorage.key(i)) || "";
        const itemObject = JSON.parse(item);
        cart.push(itemObject);
    };
};

retrieveItemsFromStorage();

// Création des fonctions d'affichage du panier et de modification des éléments

function displayItem(item){
    const article = makeArticle(item);
    const imageDiv = makeImageDiv(item);
    article.appendChild(imageDiv);
    const cardItemContent = makeCartContent(item);
    article.appendChild(cardItemContent);
    displayArticle(article);
    displayTotalPrice();
    displayTotalQuantity();
};

cart.forEach((item) => displayItem(item))

function makeCartContent(item){
    const cardItemContent = document.createElement("div");
    cardItemContent.classList.add("cart__item__content");

    const description = makeDescription(item);
    const settings = makeSettings(item);

    cardItemContent.appendChild(description);
    cardItemContent.appendChild(settings);
    return cardItemContent;
};

function makeDescription(item){
    const description = document.createElement("div");
    description.classList.add("cart__item__content__description");
    
    const h2 = document.createElement("h2");
    h2.textContent = item.name;
    const p = document.createElement("p");
    p.textContent = item.color;
    const p2 = document.createElement("p");
    p2.textContent = item.price + "€";
    description.appendChild(h2);
    description.appendChild(p);
    description.appendChild(p2);
    return description;
};

function makeSettings(item){
    const settings = document.createElement("div");
    settings.classList.add("cart__item__content__settings");

    addQuantityToSettings(settings, item);
    addDeleteToSettings(settings, item);
    return settings;
};

function displayArticle(article){
    document.querySelector("#cart__items").appendChild(article);
};

function makeArticle(item){
    const article = document.createElement("article");
    article.classList.add("card__item");
    article.dataset.id = item.id;
    article.dataset.color = item.color;
    return article;
};

function makeImageDiv(item){
    const div = document.createElement("div");
    div.classList.add("cart__item__img");
    const image = document.createElement("img");
    image.src = item.imageUrl;
    image.alt = item.altTxt;
    div.appendChild(image);
    return div;
};

function addQuantityToSettings(settings, item){
    const quantity = document.createElement("div");
    quantity.classList.add("cart__item__content__settings__quantity");
    const p = document.createElement("p");
    p.textContent = "Qté : ";
    quantity.appendChild(p);
    const input = document.createElement("input");
    input.type = "number";
    input.classList.add("itemQuantity");
    input.name = "itemQuantity";
    input.min = "1";
    input.max = "100";
    input.value = item.quantity;
    input.addEventListener("input", () => updatePriceQuantity(item.id, input.value, item));
    input.addEventListener("input", () => isQuantityInvalid(item.id, input.value, item));
    quantity.appendChild(input);
    settings.appendChild(quantity);
};

function isQuantityInvalid(id, newValue, item){
    const itemUpdate = cart.find(item => item.id === id);
    itemUpdate.quantity = Number(newValue);
    item.quantity = itemUpdate.quantity;
    if(item.quantity<0 || item.quantity>100){
        alert("Veuillez sélectionner une quantité correcte")
        item.quantity = 1;
    }
    displayTotalQuantity();
    displayTotalPrice();
    saveNewDataToCache(item);
    return item.quantity
}

function addDeleteToSettings(settings, item){
    const div = document.createElement("div");
    div.classList.add("cart__item__content__settings__delete");
    div.addEventListener("click", () => deleteItem(item));

    const p = document.createElement("p");
    p.textContent = "Supprimer";
    div.appendChild(p);
    settings.appendChild(div);
};

function deleteItem(item){
    const itemToDelete = cart.findIndex((product) => product.id === item.id && product.color === item.color);
    cart.splice(itemToDelete, 1);
    displayTotalPrice();
    displayTotalQuantity();
    deleteDataFromCache(item);
    deleteArticleFromPage(item);
};

function displayTotalPrice(){
    const totalPrice = document.querySelector("#totalPrice");
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    totalPrice.textContent = total;
};

function displayTotalQuantity(){
    const totalQuantity = document.querySelector("#totalQuantity");
    const total = cart.reduce((total, item) => total + item.quantity, 0);
    totalQuantity.textContent = total;
};

function updatePriceQuantity(id, newValue, item){
    const itemUpdate = cart.find(item => item.id === id);
    itemUpdate.quantity = Number(newValue);
    item.quantity = itemUpdate.quantity;
    displayTotalQuantity();
    displayTotalPrice();
    saveNewDataToCache(item);
};

// Fonctions de suppression des éléments

function deleteDataFromCache(item){
    const key = `${item.id}-${item.color}`;
    localStorage.removeItem(key);
};

function saveNewDataToCache(item){
    const dataToSave = JSON.stringify(item);
    const key = `${item.id}-${item.color}`;
    localStorage.setItem(key, dataToSave);
};

function deleteArticleFromPage(item){
    const articleToDelete = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`
    );
    articleToDelete.remove();
};

// Création des fonctions d'utilisation du formulaire et des messages d'erreur

function submitForm(e){
    e.preventDefault();
    if (cart.length === 0) {
        alert("Veuillez ajouter votre commande au panier svp");
        return;
    };

    if (isFormInvalid()) return;
    if (isEmailInvalid()) return;
    

    const body = makeRequestBody();

    // Requête POST pour envoyer la commande client au serveur
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((res) => res.json())
        .then((data) =>{
            const orderId = data.orderId
            window.location.href= "confirmation.html" + "?orderId=" + orderId
        })
};

orderButton.addEventListener("click", (e) => submitForm(e));

function isEmailInvalid(){
    const email = document.querySelector("#email").value;
    const regex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (regex.test(email) === false){
        alert("Veuillez entrer une adresse email valide svp");
        return true;
    }
    else{
        return false;
    }
    
};

function isFormInvalid(){
    const form = document.querySelector(".cart__order__form");
    const inputs = form.querySelectorAll("input");
    const prenom = document.querySelector("#firstName").value;
    const nom = document.querySelector("#lastName").value;
    const regex = /^(?:[^\d\W][\-\s\']{0,1}){2,20}$/;
    console.log(inputs)
    for (input of inputs){
        console.log(input.value)
        if (input.value === ""){
            alert("Veuillez compléter tous les champs svp");
            return true;
        }
        else if (regex.test(prenom, nom) === false){
            alert("Veuillez entrer un nom correct svp");
            return true;
        }
    }
    return false
};




// Mise en forme des informations client pour la requête POST

function makeRequestBody(){
    const form = document.querySelector(".cart__order__form");
    const firstName = form.elements.firstName.value;
    const lastName = form.elements.lastName.value;
    const address = form.elements.address.value;
    const city = form.elements.city.value;
    const email = form.elements.email.value;
    const body = {
        contact: {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        },
        products: getIdsFromCache()
    };
    return body;
};

// Récupération de l'ID pour le message de confirmation de commande

function getIdsFromCache(){
    const numberOfProducts = localStorage.length;
    const ids = [];
    for (let i = 0; i < numberOfProducts; i++){
        const key = localStorage.key(i);
        const id = key.split("-")[0];
        ids.push(id);
    }
    return ids;
};
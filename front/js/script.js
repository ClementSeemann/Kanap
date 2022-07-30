// Affichage des produits de la page d'accueil
// Requête Fetch pour récupérer les produits de l'API

fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((kanaps) => addProducts(kanaps))


// Création des fonctions d'affichage
    
function addProducts(kanaps){
    kanaps.forEach(kanap => {
        const {_id, imageUrl, altTxt, name, description} = kanap;
        const anchor = makeAnchor(_id);
        const article = document.createElement("article");
        const image = makeImage(imageUrl, altTxt);
        const h3 = makeH3(name);
        const p = makeParagraph(description);

        appendElementsToArticle(article, [image, h3, p]);
        appendArticleToAnchor(anchor, article);
    });
};

function appendElementsToArticle(article, array){
    array.forEach((item) => {
        article.appendChild(item);
    });
};

function makeAnchor(id){
    const anchor = document.createElement("a");
    anchor.href = "./product.html?id=" + id;
    return anchor;
};

function appendArticleToAnchor(anchor, article){
    const items = document.querySelector("#items");
    if (items !=null) {
        items.appendChild(anchor);
        anchor.appendChild(article);
    };  
};

function makeImage(imageUrl, altTxt){
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = altTxt;
    image.removeAttribute("title");
    image.removeAttribute("style");
    return image;
};

function makeH3(name){
    const h3 = document.createElement("h3");
    h3.textContent = name;
    h3.classList.add("productName");
    return h3;
};

function makeParagraph(description){
    const p = document.createElement("p");
    p.textContent = description;
    p.classList.add("productDescription");
    return p;
};
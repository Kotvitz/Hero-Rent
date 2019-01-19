import chargePayment from './basket-manager.js';
import fillBasket from './basket-manager.js'
import loadFromLocalStorage from './store-data.js'
import saveToLocalStorage from './store-data.js'

let heroBox = null;

function createHero() {
    let hero = {};
    let data = new FormData(document.getElementById('hero-form'));
    for (const [key, value] of data.entries()) {
        hero[key] = value;
    }
    Object.assign(hero, { isAvailable: true });
    fetch("http://localhost:3000/heroes", {
        method: "POST",
        body: JSON.stringify(hero),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(res => {
            alert("Dodano herosa " + res.name);
        })
}

function rentHero(heroName) {
    let heroes = loadFromLocalStorage("heroes");
    let basket = loadFromLocalStorage("basket");
    for (let hero of heroes) {
        if (hero.name == heroName) {
            hero.isAvailable = false;
            basket.push(hero);
        }
    }
    document.getElementById(heroName + "-to-basket").disabled = true;
    saveToLocalStorage("heroes", heroes);
    saveToLocalStorage("basket", basket);
    let rented = document.getElementsByClassName("rented-hero");
    if (rented != null) {
        while (rented[0]) {
            rented[0].parentNode.removeChild(rented[0]);
        }
    }
    chargePayment(basket);
    fillBasket(basket);
}

function createHeroBox(hero) {
    heroBox = document.createElement("div");
    heroBox.id = hero.name + "-box";
    heroBox.className = "modal";
    let heroBoxContentHtml = `<div class="modal-content"><span class="close">&times</span><div id="` + hero.name + `-photo" class="hero-box-photo">
    <img src="` + hero.image + `" style="width: 100%; height: auto;"></div>
    <div id="` + hero.name + `-box-text-content" class="hero-box-text-content"><h1>I'M THE ` + hero.name.toUpperCase() + `!</h1>
    <p>` + hero.description + `</p><h2 id="` + hero.name + `-rent">WYNAJEM: ` + hero.price + ` ZŁ/H</h2>
    <button id="` + hero.name + `-to-basket" class="rent-button">DODAJ DO KOSZYKA</button></div></div>`;
    heroBox.innerHTML = heroBoxContentHtml;
    let rentButton = heroBox.getElementsByClassName("rent-button")[0];
    rentButton.onclick = function () { rentHero(hero.name) };
}

function openHeroBox(heroName) {
    let modal = document.getElementById(heroName + "-box");
    let spans = document.getElementsByClassName("close");
    let heroes = loadFromLocalStorage("heroes");
    modal.style.display = "block";
    for (let hero of heroes) {
        if (hero.name == heroName && hero.isAvailable == false) {
            document.getElementById(hero.name + "-to-basket").disabled = true;
        }
    }
    for (let span of spans) {
        span.addEventListener('click', function () {
            modal.style.display = "none";
        });
    }
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    })
}

export default function createHeroProfile(heroes) {
    for (let hero of heroes) {
        let heroDiv = document.createElement("div");
        let img = document.createElement("img");
        let heroName = document.createElement("p");
        let price = document.createElement("p");
        heroDiv.id = hero.name + "-profile";
        heroDiv.className = "hero-profile"
        img.src = hero.image;
        img.className = "hero-image"
        img.style.cursor = "pointer";
        img.onclick = function () { openHeroBox(hero.name) };
        heroName.className = "hero-name";
        heroName.innerHTML = hero.name;
        price.className = "price";
        price.innerHTML = "Cena wynajmu: " + hero.price + " zł/h";
        createHeroBox(hero);
        heroDiv.appendChild(img);
        heroDiv.appendChild(heroName);
        heroDiv.appendChild(price);
        heroDiv.appendChild(heroBox);
        document.getElementById('heroZone').appendChild(heroDiv);
    }
}

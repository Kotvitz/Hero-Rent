import loadFromLocalStorage from './store-data.js'
import saveToLocalStorage from './store-data.js'

export default function chargePayment(basket) {
    let payment = 0.00;
    for (let i = 0; i < basket.length; i++) {
        payment += parseFloat(basket[i].price);
    }
    if (payment != 0) {
        document.getElementsByClassName("empty-basket")[0].style.display = "none";
    } else {
        document.getElementsByClassName("empty-basket")[0].style.display = "block";
    }
    document.getElementsByClassName("payment")[0].innerHTML = payment + " zł";
}

export function fillBasket(basket) {
    basket.map(function (rented) {
        let rentedHeroDivHtml = `<div id="` + rented.name + `-img" class="hero-photo-in-basket"><img src="` + rented.image + `" 
         style="width: 200px; height: 200px;"></div><div id="` + rented.name + `"-rented-content class="rented-hero-content">
         <p style="font-size: 20px;">` + rented.name.toUpperCase() + `</p><p>` + rented.description + `
         </p><button id="` + rented.name + `-remove-btn" class="removing-hero-from-basket">
         USUŃ Z KOSZYKA</button></div>`;
        let rentedHeroDiv = document.createElement("div");
        rentedHeroDiv.id = rented.name + "-rented";
        rentedHeroDiv.className = "rented-hero"
        rentedHeroDiv.innerHTML = rentedHeroDivHtml;
        let removeButton = rentedHeroDiv.getElementsByClassName("removing-hero-from-basket")[0];
        removeButton.onclick = function () { removeHeroFromBasket(rented.name) };
        document.getElementById('your-basket').appendChild(rentedHeroDiv);
    });
}

function removeHeroFromBasket(rentedHeroName) {
    let basket = loadFromLocalStorage("basket");
    let heroes = loadFromLocalStorage("heroes");
    for (let i = 0; i < basket.length; i++) {
        if (basket[i].name == rentedHeroName) {
            let item = basket.indexOf(basket[i]);
            if (item != -1) {
                basket.splice(item, 1);
            }
        }
    }
    heroes.map(function (hero) {
        if (hero.name == rentedHeroName) {
            hero.isAvailable = true;
            document.getElementById(hero.name + "-to-basket").disabled = false;
        }
    });
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

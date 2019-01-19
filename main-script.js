import loadFromLocalStorage from './store-data.js';
import saveToLocalStorage from './store-data.js';
import createHeroProfile from './hero-manager.js';
import chargePayment from './basket-manager.js';
import fillBasket from './basket-manager.js'

let arr = new Array();
let arr2 = new Array();

function clearBase() {
    fetch("http://localhost:3000/heroes", {
        method: "DELETE"
    }).then(alert("Baza herosow zostala wyczyszczona."));
}

function createHamburgerMenu() {
    let hamburger = document.getElementsByClassName("hamburger")[0];
    hamburger.addEventListener('click', () => hamburger.classList.contains('is-active') ? closeNav() : openNav());
    closeNav();
}

function createHeroes() {
    if (loadFromLocalStorage("heroes") === null && loadFromLocalStorage("basket") === null) {
        saveToLocalStorage("heroes", arr);
        saveToLocalStorage("basket", arr2);
    } else {
        showHeroesList();
    }
}

function showHeroesList() {
    if (document.getElementById('heroZone')) {
        let heroes = loadFromLocalStorage("heroes");
        let basket = loadFromLocalStorage("basket");
        chargePayment(basket);
        if (basket != null) {
            fillBasket(basket);
        }
        createHeroProfile(heroes);
    }
}

function openNav() {
    let hamburger = document.getElementsByClassName("hamburger")[0];
    hamburger.classList.add("is-active");
    document.getElementById("hamburger-menu").style.display = "block";
}

function closeNav() {
    let hamburger = document.getElementsByClassName("hamburger")[0];
    hamburger.classList.remove("is-active");
    document.getElementById("hamburger-menu").style.display = "none";
}

function init() {
    createHamburgerMenu();
    createHeroes();
}

document.addEventListener('DOMContentLoaded', function () {
    let heroes = [];
    fetch("http://localhost:3000/heroes")
        .then((resp) => resp.json())
        .then(function (data) {
            console.log(data);
            data.map(function (hero) {
                heroes.push(hero);
            })
        })
    init();
}, false);

let arr = new Array();
let arr2 = new Array();
let heroBox = null;

function createHero() {
    let hero = {};
    let data = new FormData(document.getElementById('hero-form'));
    for (const [key, value] of data.entries()) {
        hero[key] = value;
    }
    Object.assign(hero, { isAvailable: true });
    let heroes = JSON.parse(localStorage.getItem("heroes"));
    heroes.push(hero);
    localStorage.setItem("heroes", JSON.stringify(heroes));
}

function clearBase() {
    localStorage.clear();

    if (localStorage.length == 0) {
        alert('Baza herosów została wyczyszczona.');
    }
    location.reload();
}

function rentHero(heroName) {
    let heroes = JSON.parse(localStorage.getItem("heroes"));
    let basket = JSON.parse(localStorage.getItem("basket"));
    for (let hero of heroes) {
        if (hero.name == heroName) {
            hero.isAvailable = false;
            basket.push(hero);
        }
    }
    document.getElementById(heroName + "-to-basket").disabled = true;
    localStorage.setItem("heroes", JSON.stringify(heroes));
    localStorage.setItem("basket", JSON.stringify(basket));
    let rented = document.getElementsByClassName("rented-hero");
    if (rented != null) {
        while (rented[0]) {
            rented[0].parentNode.removeChild(rented[0]);
        }
    }
    chargePayment(basket);
    fillBasket(basket);
}

function chargePayment(basket) {
    let payment = 0.00;
    for (let i = 0; i < basket.length; i++) {
        payment += parseFloat(basket[i].price);
    }
    if (payment != 0) {
        document.getElementById("empty-basket").style.display = "none";
    } else {
        document.getElementById("empty-basket").style.display = "block";
    }
    document.getElementById("payment").innerHTML = payment + " zł";
}

function fillBasket(basket) {
    basket.map(function (rented) {
        let rentedHeroDiv = document.createElement("div");
        let img = document.createElement("img");
        let rentedHeroName = document.createElement("p");
        let description = document.createElement("p");
        let rentedHeroImg = document.createElement("div");
        let rentedHeroContent = document.createElement("div");
        let removeButton = document.createElement("button");
        rentedHeroDiv.id = rented.name + "-rented";
        rentedHeroDiv.className = "rented-hero"
        rentedHeroContent.id = rented.name + "-rented-content";
        rentedHeroContent.className = "rented-hero-content";
        img.src = rented.image;
        img.style.width = "200px";
        img.style.height = "200px";
        rentedHeroName.style.fontSize = "20px";
        rentedHeroName.innerHTML = rented.name.toUpperCase();
        description.innerHTML = rented.description;
        rentedHeroImg.id = rented.name + "-img";
        rentedHeroImg.className = "hero-photo-in-basket";
        removeButton.id = rented.name + "-remove-btn";
        removeButton.className = "removing-hero-from-basket"
        removeButton.innerHTML = "USUŃ Z KOSZYKA";
        removeButton.onclick = function () { removeHeroFromBasket(rented.name) };
        rentedHeroImg.appendChild(img);
        rentedHeroContent.appendChild(rentedHeroName);
        rentedHeroContent.appendChild(description);
        rentedHeroContent.appendChild(removeButton);
        rentedHeroDiv.appendChild(rentedHeroImg);
        rentedHeroDiv.appendChild(rentedHeroContent);
        document.getElementById('basket').appendChild(rentedHeroDiv);
    });
}

function removeHeroFromBasket(rentedHeroName) {
    let basket = JSON.parse(localStorage.getItem("basket"));
    let heroes = JSON.parse(localStorage.getItem("heroes"));
    for (let i = 0; i < basket.length; i++) {
        if (basket[i].name == rentedHeroName) {
            let item = basket.indexOf(basket[i]);
            if (item != -1) {
                basket.splice(item, 1);
            }
        }
    }
    console.log(basket);
    heroes.map(function (hero) {
        if (hero.name == rentedHeroName) {
            hero.isAvailable = true;
            document.getElementById(hero.name + "-to-basket").disabled = false;
        }
    });
    localStorage.setItem("heroes", JSON.stringify(heroes));
    localStorage.setItem("basket", JSON.stringify(basket));
    let rented = document.getElementsByClassName("rented-hero");
    if (rented != null) {
        while (rented[0]) {
            rented[0].parentNode.removeChild(rented[0]);
        }
    }
    chargePayment(basket);
    fillBasket(basket);
}

function openHeroBox(heroName) {
    let modal = document.getElementById(heroName + "-box");
    let spans = document.getElementsByClassName("close");
    let heroes = JSON.parse(localStorage.getItem("heroes"));
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

function createHeroBox(hero) {
    heroBox = document.createElement("div");
    let heroBoxContent = document.createElement("div");
    let heroBoxClose = document.createElement("span");
    let heroBoxTitle = document.createElement("h1");
    let heroBoxInfo = document.createElement("p");
    let heroBoxRentInfo = document.createElement("h2");
    let heroBoxImg = document.createElement("img");
    let heroBoxDescription = document.createElement("div");
    let heroBoxPhoto = document.createElement("div");
    let heroBoxRent = document.createElement("div");
    let heroBoxButton = document.createElement("button");
    heroBoxImg.src = hero.image;
    heroBoxImg.style.width = "400px";
    heroBoxImg.style.height = "400px";
    heroBox.id = hero.name + "-box";
    heroBox.className = "modal";
    heroBoxContent.className = "modal-content";
    heroBoxClose.className = "close";
    heroBoxClose.innerHTML = "&times;"
    heroBoxInfo.innerHTML = hero.description;
    heroBoxTitle.innerHTML = "I'M THE " + hero.name.toUpperCase() + "!";
    heroBoxRentInfo.innerHTML = "WYNAJEM: " + hero.price + " ZŁ/H";
    heroBoxDescription.id = hero.name + "-description";
    heroBoxPhoto.style.display = "inline-block";
    heroBoxDescription.style.display = "inline-block";
    heroBoxPhoto.id = hero.name + "-photo";
    heroBoxPhoto.appendChild(heroBoxImg);
    heroBoxRentInfo.id = hero.name + "-rent";
    heroBoxButton.id = hero.name + "-to-basket";
    heroBoxButton.className = "rent-button";
    heroBoxButton.innerHTML = "DODAJ DO KOSZYKA";
    heroBoxButton.onclick = function () { rentHero(hero.name) };
    heroBoxRent.appendChild(heroBoxButton);
    heroBoxDescription.appendChild(heroBoxTitle);
    heroBoxDescription.appendChild(heroBoxInfo);
    heroBoxDescription.appendChild(heroBoxRentInfo);
    heroBoxContent.appendChild(heroBoxClose);
    heroBoxContent.appendChild(heroBoxPhoto);
    heroBoxContent.appendChild(heroBoxDescription);
    heroBoxContent.appendChild(heroBoxRent);
    heroBox.appendChild(heroBoxContent);
}

function createHeroProfile(heroes) {
    for (let hero of heroes) {
        let heroDiv = document.createElement("div");
        let img = document.createElement("img");
        let heroName = document.createElement("p");
        let price = document.createElement("p");
        heroDiv.id = hero.name + "-profile";
        heroDiv.className = "hero-profile"
        img.src = hero.image;
        img.style.width = "400px";
        img.style.height = "400px";
        img.style.cursor = "pointer";
        img.onclick = function () { openHeroBox(hero.name) };
        heroName.style.fontSize = "200%";
        heroName.style.textAlign = "center";
        heroName.innerHTML = hero.name;
        price.style.textAlign = "center";
        price.innerHTML = "Cena wynajmu: " + hero.price + " zł/h";
        createHeroBox(hero);
        heroDiv.appendChild(img);
        heroDiv.appendChild(heroName);
        heroDiv.appendChild(price);
        heroDiv.appendChild(heroBox);
        document.getElementById('heroZone').appendChild(heroDiv);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem("heroes") === null && localStorage.getItem("basket") === null) {
        localStorage.setItem("heroes", JSON.stringify(arr));
        localStorage.setItem("basket", JSON.stringify(arr2));
    }
    else {
        if (document.getElementById('heroZone')) {
            let heroes = JSON.parse(localStorage.getItem("heroes"));
            let basket = JSON.parse(localStorage.getItem("basket"));
            chargePayment(basket);
            if (basket != null) {
                fillBasket(basket);
            }
            createHeroProfile(heroes);
        }
    }
}, false);

let arr = new Array();
function createHero() {
    let hero = {};
    let data = new FormData(document.getElementById('hero-form'));
    for (const [key, value] of data.entries()) {
        hero[key] = value;
    }
    Object.assign(hero, {isAvailable: true});
    let heroes = JSON.parse(localStorage.getItem("heroes"));
    heroes.push(hero);
    localStorage.setItem("heroes", JSON.stringify(heroes));
}

function clearBase() {
    localStorage.clear();
    if(localStorage.length == 0) {
        alert('Baza herosów została wyczyszczona.');
    }
    location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    if(localStorage.getItem("heroes") === null) {
        localStorage.setItem("heroes", JSON.stringify(arr));
    } 
    else {
        if(document.getElementById('heroZone')) {
            let heroes = JSON.parse(localStorage.getItem("heroes"));
            for(let i = 0; i < heroes.length; i++) {
                let heroDiv = document.createElement("div");
                let img = document.createElement("img");
                let heroName = document.createElement("p");
                let price = document.createElement("p");
                heroDiv.id = heroes[i].name + "-profile";
                heroDiv.style.cssFloat = "left";
                img.src = heroes[i].image;
                img.style.width = "400px";
                img.style.height = "400px";
                heroName.style.fontSize = "200%";
                heroName.innerHTML = heroes[i].name;
                price.innerHTML = "Cena wynajmu: " + heroes[i].price + " zł/h";
                heroDiv.appendChild(img);
                heroDiv.appendChild(heroName);
                heroDiv.appendChild(price);
                document.getElementById('heroZone').appendChild(heroDiv);
            }
        }
    }
 }, false);

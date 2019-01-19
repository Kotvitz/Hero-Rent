export default function loadFromLocalStorage(key) {
    let item = JSON.parse(localStorage.getItem(key));
    return item;
}

export function saveToLocalStorage(key, item) {
    localStorage.setItem(key, JSON.stringify(item));
}
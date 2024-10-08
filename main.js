import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { detecIcon, detecType, setStorage } from "./helpers.js";


const form = document.querySelector("form");
const list = document.querySelector("ul");

form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);


var map;
var layerGroup = [];
var notes = JSON.parse(localStorage.getItem("notes")) || [];
var coords = [];


navigator.geolocation.getCurrentPosition(loadMap, errorFunction);
function errorFunction() {
    ("hata");
}
function onMapClick(e) {
    form.style.display = "flex";
    e;
    coords = [e.latlng.lat, e.latlng.lng];
    coords;
}
function loadMap(e) {
    map = L.map("map").setView([e.coords.latitude, e.coords.longitude], 10);
    L.control;
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    layerGroup = L.layerGroup().addTo(map);

    renderNoteList(notes);

    map.on("click", onMapClick);
}

function renderMarker(item) {
    L.marker(item.coords, { icon: detecIcon(item.status) })
        .addTo(layerGroup) // imleçlerin olduğu katmana ekler
        .bindPopup(`${item.desc}`); // üzerine tıklanınca açılacak popup ekleme
}

function handleSubmit(e) {
    e.preventDefault(); //* Sayfanın yenilenmesini engeller
    e;
    const desc = e.target[0].value; // Formun içerisindeki text inputun değerini alma
    const date = e.target[1].value; // Formun içerisindeki date inputunun değerini alma
    const status = e.target[2].value; // Formun içerisindeki select yapısının değerini alma

    notes.push({
        id: uuidv4(),
        desc,
        date,
        status,
        coords,
    });

    setStorage(notes);
    renderNoteList(notes);

    form.style.display = "none";
}

function renderNoteList(item) {
    list.innerHTML = "";
    layerGroup.clearLayers();
    item.forEach((item) => {
        const listElement = document.createElement("li"); //* bir li etiketi oluşturur
        listElement.dataset.id = item.id; //* li etiketine data-id özelliği ekleme
        listElement;
        listElement.innerHTML = `
    <div>
        <p>${item.desc}</p>
        <p><span>Tarih:</span>${item.date}</p>
        <p><span>Durum:</span>${detecType(item.status)}</p>
    </div>
    <i class="bi bi-x" id="delete"></i>
    <i class="bi bi-airplane-fill" id="fly"></i>
    
    `;
        list.insertAdjacentElement("afterbegin", listElement);

        renderMarker(item);
    });
}
function handleClick(e) {
    const id = e.target.parentElement.dataset.id;
    console.log(id);
    if (e.target.id === "delete") {
        notes = notes.filter((note) => note.id != id);
        console.log(notes);
        setStorage(notes); //* localStorage güncelle
        renderNoteList(notes); //* ekranı güncelle
    }

    if (e.target.id === "fly") {
        const note = notes.find((note) => note.id == id);
        console.log(note);
        map.flyTo(note.coords); //* Haritayı bulduğumuz elemana yönlendirmesi için flyTo methodunu kullandık.
    }
}
import L from "leaflet";

// Test import of a JavaScript module
// import { example } from '@/js/example'

// Test import of an asset
// import webpackLogo from '@/images/webpack-logo.svg'

// Test import of styles
import '@/styles/index.scss'

const map = L.map('map').setView([48.144, 17.113], 15);

// setInterval(() => {
//   console.log(map.getZoom())
// }, 2000)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let currentPage = 1;
let lastPage = 0;

fetch(`http://localhost:3000?page=${currentPage}`)
  .then(r => r.text())
  .then(data => {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(data, "text/html");

    const pagination = [...htmlDocument.querySelectorAll('.component-pagination__item')];
    console.log(pagination)
    lastPage = Number(pagination[pagination.length - 2].innerText);

    const links = [...htmlDocument.querySelectorAll('.advertisement-item--content__title')].map(e => e.attributes.href.value)
    links.slice(0, 10).forEach(link => {
      drawMarker(link)
    })

    currentPage++;
    goOverAllPages()
  })

const goOverAllPages = () => {
  new Array(lastPage - currentPage).fill(null).forEach(() => {
    fetch(`http://localhost:3000?page=${currentPage}`)
      .then(r => r.text())
      .then(data => {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, "text/html");

        const links = [...htmlDocument.querySelectorAll('.advertisement-item--content__title')].map(e => e.attributes.href.value)
        links.slice(0, 10).forEach(link => {
          drawMarker(link)
        })
      })
    currentPage++;

  })
}

const drawMarker = (link) => {
  fetch(`http://localhost:3000/one?url=${encodeURI(link)}`)
    .then(r => r.text())
    .then(data => {
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(data, "text/html");
      const mapComponent = htmlDocument.querySelector('[data-gps-marker]')
      const stringData = mapComponent.attributes['data-gps-marker'].value;
      const coords = JSON.parse(stringData);
      L.marker([coords.gpsLatitude, coords.gpsLongitude]).addTo(map)
        .bindPopup(
          `<a 
            href="${encodeURI(link)}" 
            target="_blank"
         >
            ${htmlDocument.querySelector('.price--info .price--main').innerText} |
            ${htmlDocument.querySelector('.price--info .price--info-note').innerText}
        </a>`
        );
    })

}

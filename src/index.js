import L from "leaflet";

import '@/styles/index.scss'
import { genMarker } from "@/helpers";
import { fetchListingPage, fetchOneOffer } from "@/api";

const map = L.map('map').setView([48.144, 17.113], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const nehnutConfig = {
  label: "nehnut",
  offersPerPage: 30,
  totalOffers: '.search-heading.mb-3 > .row > div:first-child',
  offerLink: '.advertisement-item--content__title',
  price: '.price--info .price--main',
  info: '.price--info .price--info-note',

  locationMarker: '[data-gps-marker]',
  getCoords: (locationMarker) => {
    const stringData = locationMarker.attributes['data-gps-marker'].value;
    const { gpsLatitude, gpsLongitude } = JSON.parse(stringData);
    return { lat: gpsLatitude, lng: gpsLongitude }
  }
}
const realityConfig = {
  label: "reality",
  offersPerPage: 24,
  totalOffers: '.page-title ~ div',
  offerLink: '.offer-img-wrapper > a',
  price: '.contact-title',
  info: '',

  locationMarker: '.map',
  getCoords: (locationMarker) => {
    const lat = locationMarker.attributes["data-latitude"].value;
    const lng = locationMarker.attributes["data-longitude"].value;
    return { lat, lng }
  }
}


const getNumberOfPages = (config, document) => {
  const allOffers = document.querySelector(config.totalOffers).innerText.trim().split(" ")[0]
  return Math.ceil(Number(allOffers) / config.offersPerPage)
}

const drawMarker = (config, offerPage, link) => {
  const locationMarker = offerPage.querySelector(config.locationMarker)
  const { lat, lng } = config.getCoords(locationMarker)

  const text = `
        ${offerPage.querySelector(config.price).innerText} |
        ${config.info ?? offerPage.querySelector(config.info).innerText}
      `
  const fixedLink = config.label === 'reality' ? `https://www.reality.sk${link}` : link

  genMarker(lat, lng, fixedLink, text).addTo(map)
}

const parseSite = async (config) => {
  const numberOfPages = getNumberOfPages(config, await fetchListingPage(1, config.label))

  new Array(numberOfPages).fill(null).forEach(async (_, i) => {
    const listingPage = await fetchListingPage(i + 1, config.label);

    const links = [...listingPage.querySelectorAll(config.offerLink)].map(e => e.attributes.href.value)
    links.forEach(async (link) => {
      const offerPage = await fetchOneOffer(link, config.label);
      drawMarker(config, offerPage, link);
    })
  })
}

parseSite(nehnutConfig)
parseSite(realityConfig)

// fetch(`http://localhost:3000?page=${currentPage}`)
//   .then(r => r.text())
//   .then(data => {
//     const htmlDocument = getDom(data);
//
//     const pagination = [...htmlDocument.querySelectorAll('.component-pagination__item')];
//     console.log(pagination)
//     lastPage = Number(pagination[pagination.length - 2].innerText);
//
//     const links = [...htmlDocument.querySelectorAll('.advertisement-item--content__title')].map(e => e.attributes.href.value)
//     links.forEach(link => {
//       drawMarker(link)
//     })
//
//     currentPage++;
//     goOverAllPages()
//   })

// const goOverAllPages = () => {
//   new Array(lastPage - currentPage).fill(null).forEach(() => {
//     fetch(`http://localhost:3000?page=${currentPage}`)
//       .then(r => r.text())
//       .then(data => {
//         const htmlDocument = getDom(data);
//
//         const links = [...htmlDocument.querySelectorAll('.advertisement-item--content__title')].map(e => e.attributes.href.value)
//         links.forEach(link => {
//           drawMarker(link)
//         })
//       })
//     currentPage++;
//
//   })
// }

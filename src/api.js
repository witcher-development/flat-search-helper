import { getDom } from "@/helpers";

export const fetchListingPage = (pageNumber, site) => {
  return new Promise((res) => {
    fetch(`http://localhost:3000/listing?page=${pageNumber}&site=${site}`)
      .then(r => r.text())
      .then(data => res(getDom(data)))
  })
}

export const fetchOneOffer = (url, site) => {
  return new Promise((res) => {
    fetch(`http://localhost:3000/oneOffer?url=${url}&site=${site}`)
      .then(r => r.text())
      .then(data => res(getDom(data)))
  })
}

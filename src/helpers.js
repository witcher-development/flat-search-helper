import L from "leaflet";

export const getDom = (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, "text/html");
}

export const genMarker = (lat, lng, link, text) => {
  return L.marker([lat, lng])
    .bindPopup(
      `<a 
            href="${encodeURI(link)}" 
            target="_blank"
         >
            ${text}
        </a>`
    );
}

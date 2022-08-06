// A bunch of static information about the countries

import { LngLat } from "./components/Globe";

export type Country = {
  name: string;
  city: string;
  airport: string;
  month: string;
  year: string;
  lngLat: LngLat;
};

const COUNTRIES = {
  croatia: {
    name: "Croatia",
    city: "Split",
    airport: "SPU",
    month: "09",
    year: "2022",
    lngLat: [16.440193, 43.508133],
  } as Country,
  spain: {
    name: "Spain",
    city: "Valencia",
    airport: "VLC",
    month: "10",
    year: "2022",
    lngLat: [-0.375, 39.466667],
  } as Country,
  portugal: {
    name: "Portugal",
    city: "Lisbon",
    airport: "LIS",
    month: "11",
    year: "2022",
    lngLat: [-9.142685, 38.736946],
  } as Country,
  southafrica: {
    name: "South Afria",
    city: "Cape Town",
    airport: "CPT",
    month: "12",
    year: "2022",
    lngLat: [18.4233, -33.918861],
  } as Country,
  vietnam: {
    name: "Vietnam",
    city: "Hanoi",
    airport: "HAN",
    month: "01",
    year: "2023",
    lngLat: [105.804817, 21.028511],
  } as Country,
  thailand: {
    name: "Thailand",
    city: "Chiang Mai",
    airport: "CNX",
    month: "02",
    year: "2023",
    lngLat: [98.979263, 18.796143],
  } as Country,
  indonesia: {
    name: "Indonesia",
    city: "Bali",
    airport: "DPS",
    month: "03",
    year: "2023",
    lngLat: [115.188919, -8.409518],
  } as Country,
  japan: {
    name: "Japan",
    city: "Osaka",
    airport: "ITM",
    month: "04",
    year: "2023",
    lngLat: [135.484802, 34.672314],
  } as Country,
  lima: {
    name: "Peru",
    city: "Lima",
    airport: "LAP",
    month: "05",
    year: "2023",
    lngLat: [-77.042793, -12.046374],
  } as Country,
  brazil: {
    name: "Brazil",
    city: "Florianopolis",
    airport: "FLN",
    month: "06",
    year: "2023",
    lngLat: [-48.55854, -27.5935],
  } as Country,
  columbia: {
    name: "Columbia",
    city: "Medellin",
    airport: "MDE",
    month: "07",
    year: "2023",
    lngLat: [-75.590553, 6.230833],
  } as Country,
  mexico: {
    name: "Mexico",
    city: "Mexico City",
    airport: "MEX",
    month: "08",
    year: "2023",
    lngLat: [-99.133209, 19.432608],
  },
};

export const getRandomCountry = (except?: string) => {
  const countries = Object.keys(COUNTRIES);
  let selected;
  do {
    selected = countries[Math.floor(Math.random() * countries.length)];
  } while (except != null && except === selected);
  return selected;
};

export default COUNTRIES;

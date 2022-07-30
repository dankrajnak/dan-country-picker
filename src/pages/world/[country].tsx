import axios from "axios";

import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next/types";
import useDiscount from "../../hooks/useDiscount";
import { Suspense } from "react";
import Globe from "../../components/Globe";

export type Country = {
  name: string;
  city: string;
  airport: string;
  month: string;
  year: string;
};

type FlightInfo = {
  price: number;
  gettingThere: Airport[];
  gettingHome: Airport[];
  leaveOnDate: string;
  comeHomeDate: string;
};

const COUNTRIES: Record<string, Country> = {
  croatia: {
    name: "Croatia",
    city: "Split",
    airport: "SPU",
    month: "09",
    year: "2022",
  },
  spain: {
    name: "Spain",
    city: "Valencia",
    airport: "VLC",
    month: "10",
    year: "2022",
  },
  portugal: {
    name: "Portugal",
    city: "Lisbon",
    airport: "LIS",
    month: "11",
    year: "2022",
  },
  southafrica: {
    name: "South Afria",
    city: "Cape Town",
    airport: "CPT",
    month: "12",
    year: "2022",
  },
  vietnam: {
    name: "Vietnam",
    city: "Hanoi",
    airport: "HAN",
    month: "01",
    year: "2023",
  },
  thailand: {
    name: "Thailand",
    city: "Chiang Mai",
    airport: "CNX",
    month: "02",
    year: "2023",
  },
  indonesia: {
    name: "Indonesia",
    city: "Bali",
    airport: "DPS",
    month: "03",
    year: "2023",
  },
  japan: {
    name: "Japan",
    city: "Osaka",
    airport: "ITM",
    month: "04",
    year: "2023",
  },
  lima: {
    name: "Peru",
    city: "Lima",
    airport: "LAP",
    month: "05",
    year: "2023",
  },
  brazil: {
    name: "Brazil",
    city: "Florianopolis",
    airport: "FLN",
    month: "06",
    year: "2023",
  },
  columbia: {
    name: "Columbia",
    city: "Medellin",
    airport: "MDE",
    month: "07",
    year: "2023",
  },
  mexico: {
    name: "Mexico",
    city: "Mexico City",
    airport: "MEX",
    month: "08",
    year: "2023",
  },
};

export const getRandomCountry = () => {
  const countries = Object.keys(COUNTRIES);
  return countries[Math.floor(Math.random() * countries.length)];
};

const ARC_REL_LEN = 0.4; // relative to whole arc
const FLIGHT_TIME = 1000;
const NUM_RINGS = 3;
const RINGS_MAX_R = 5; // deg
const RING_PROPAGATION_SPEED = 5;

// const DynamicGlobe = dynamic(() => import("react-globe.gl"), {
//   suspense: true,
//   ssr: false,
// });

const Country = ({
  country,
  flightInfo,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Suspense fallback={null}>
        {
          <div style={{ position: "absolute", height: "100%", width: "100%" }}>
            <Globe />
          </div>
        }
      </Suspense>
      <div
        style={{
          position: "absolute",
          bottom: 20,
          marginLeft: "auto",
          marginRight: "auto",
          zIndex: 0,
          width: "100%",
          // textAlign: "center",
        }}
      >
        <div className="text-white ">
          <div className=" border-white border-1">
            <h1 className="text-2xl tracking-tight font-extrabold mb-5">
              <span className=" font-light">{country.city},</span>{" "}
              {country.name}
            </h1>
            {flightInfo && (
              <FlightInfo flightInfo={flightInfo} country={country} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const arrayJoin = <T extends unknown>(arr: T[], elm: T): T[] => {
  return arr.reduce(
    (sum, cur, i) =>
      i === arr.length - 1 ? [...sum, cur] : [...sum, cur, elm],
    []
  );
};

const asCurrency = (number: number): string =>
  Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(number);

const asDateString = (date: string): string =>
  Intl.DateTimeFormat("en-us", {
    dateStyle: "short",
  }).format(new Date(date));

const FlightInfo = ({
  flightInfo,
  country,
}: {
  flightInfo: FlightInfo;
  country: Country;
}) => {
  const discount = useDiscount() || 200;
  return (
    <div>
      {discount ? (
        <span>
          <s>{asCurrency(flightInfo.price)}</s>
          <span className="font-bold ml-2">
            {asCurrency(Math.max(0, flightInfo.price - discount))}
          </span>
        </span>
      ) : (
        asCurrency(flightInfo.price)
      )}
      <div>
        {asDateString(flightInfo.leaveOnDate)} &ndash;{" "}
        {asDateString(flightInfo.comeHomeDate)}
      </div>
      <div className="font-thin">
        <div>
          {arrayJoin(
            flightInfo.gettingThere
              .map((airport) => airport.code)
              .concat([country.airport]),
            <span className="font-thin"> &rarr; </span>
          )}
        </div>
        <div>
          {arrayJoin(
            [country.airport].concat(
              flightInfo.gettingHome.map((airport) => airport.code)
            ),
            <span className="font-thin"> &rarr; </span>
          )}
        </div>
      </div>
    </div>
  );
};

type StaticParams = {
  country: string;
};

export const getStaticPaths: GetStaticPaths<StaticParams> = async () => {
  return {
    paths: Object.keys(COUNTRIES).map((country) => ({
      params: { country },
    })),
    fallback: false,
  };
};

type Airport = {
  code: string;
  name: string;
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  if (!context.params?.country || Array.isArray(context.params?.country)) {
    throw new Error("Could not find country.");
  }

  const country: Country = COUNTRIES[context.params?.country];
  // // try to get the price I guess
  // const resp = await axios.get("https://tequila-api.kiwi.com/v2/search", {
  //   headers: {
  //     //@ts-ignore
  //     apikey: process.env.KIWI_API_KEY,
  //   },
  //   params: {
  //     fly_from: "SEA",
  //     fly_to: country.airport,
  //     date_from: `01/${country.month}/${country.year}`,
  //     date_to: `28/${country.month}/${country.year}`,
  //     nights_in_dst_from: 4,
  //     nights_in_dst_to: 7,
  //     currency: "USD",
  //   },
  // });
  // const bestTrip = resp.data.data?.sort(
  //   (a: any, b: any) => b.quality - a.quality
  // )?.[0];

  let flightInfo: FlightInfo | null = null;
  flightInfo = JSON.parse(`
  {
    "price": 1232,
    "gettingThere": [
      {
        "code": "SEA",
        "name": "Seattle"
      },
      {
        "code": "FRA",
        "name": "Frankfurt"
      }
    ],
    "gettingHome": [
      {
        "code": "ZAG",
        "name": "Zagreb"
      },
      {
        "code": "CPH",
        "name": "Copenhagen"
      },
      {
        "code": "HEL",
        "name": "Helsinki"
      },
      {
        "code": "SEA",
        "name": "Seattle"
      }
    ],
    "leaveOnDate": "2022-09-29T00:55:00.000Z",
    "comeHomeDate": "2022-10-04T00:40:00.000Z"
  }
  `);
  // if (false) {
  //   const arrivalIndex = bestTrip.route.findIndex(
  //     (route: any) => route.flyFrom === country.airport
  //   );
  //   const thereRoutes = bestTrip.route.slice(0, arrivalIndex);
  //   const backRoutes = bestTrip.route.slice(arrivalIndex);
  //   flightInfo = {
  //     price: bestTrip.price,
  //     gettingThere: thereRoutes.map((route: any) => ({
  //       code: route.flyFrom,
  //       name: route.cityFrom,
  //     })),
  //     gettingHome: backRoutes.map((route: any) => ({
  //       code: route.flyTo,
  //       name: route.cityTo,
  //     })),
  //     leaveOnDate: thereRoutes[0].utc_departure,
  //     comeHomeDate: backRoutes[backRoutes.length - 1].utc_arrival,
  //   };
  // }

  return { props: { country, flightInfo }, revalidate: 60 * 10 };
};
export default Country;

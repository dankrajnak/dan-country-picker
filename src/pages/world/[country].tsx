import axios from "axios";

import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next/types";
import useDiscount from "../../hooks/useDiscount";
import { Suspense } from "react";
import Globe from "../../components/Globe";
import COUNTRIES, { type Country } from "../../countries";
import Link from "next/link";

type Airport = {
  code: string;
  name: string;
};

type FlightInfo = {
  price: number;
  gettingThere: Airport[];
  gettingHome: Airport[];
  leaveOnDate: string;
  comeHomeDate: string;
};

export const getRandomCountry = (except?: string) => {
  const countries = Object.keys(COUNTRIES);
  let selected;
  do {
    selected = countries[Math.floor(Math.random() * countries.length)];
  } while (except != null && except === selected);
  return selected;
};

const Country = ({
  country,
  flightInfo,
  countryName,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Suspense fallback={null}>
        {
          <div style={{ position: "absolute", height: "100%", width: "100%" }}>
            <Globe destination={country.lngLat} />
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
              <FlightInfo
                flightInfo={flightInfo}
                country={country}
                countryName={countryName}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const arrayJoin = (arr: any[], elm: unknown): any[] => {
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
  countryName,
}: {
  flightInfo: FlightInfo;
  country: Country;
  countryName: string;
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
        <div>
          <Link href={"/world/" + getRandomCountry(countryName)}>Go again</Link>
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

export const getStaticProps = async (context: GetStaticPropsContext) => {
  if (!context.params?.country || Array.isArray(context.params?.country)) {
    throw new Error("Could not find country.");
  }

  const country: Country = COUNTRIES[context.params?.country];

  const isDev = process.env.NODE_ENV === "development";

  let flightInfo: FlightInfo | null = null;
  if (isDev) {
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
  } else {
    const resp = await axios.get("https://tequila-api.kiwi.com/v2/search", {
      headers: {
        //@ts-ignore
        apikey: process.env.KIWI_API_KEY,
      },
      params: {
        fly_from: "SEA",
        fly_to: country.airport,
        date_from: `01/${country.month}/${country.year}`,
        date_to: `28/${country.month}/${country.year}`,
        nights_in_dst_from: 4,
        nights_in_dst_to: 7,
        currency: "USD",
      },
    });
    const bestTrip = resp.data.data?.sort(
      (a: any, b: any) => a.quality - b.quality
    )?.[0];
    if (bestTrip) {
      const arrivalIndex = bestTrip.route.findIndex(
        (route: any) => route.flyFrom === country.airport
      );
      const thereRoutes = bestTrip.route.slice(0, arrivalIndex);
      const backRoutes = bestTrip.route.slice(arrivalIndex);
      flightInfo = {
        price: bestTrip.price,
        gettingThere: thereRoutes.map((route: any) => ({
          code: route.flyFrom,
          name: route.cityFrom,
        })),
        gettingHome: backRoutes.map((route: any) => ({
          code: route.flyTo,
          name: route.cityTo,
        })),
        leaveOnDate: thereRoutes[0].utc_departure,
        comeHomeDate: backRoutes[backRoutes.length - 1].utc_arrival,
      };
    }
  }

  return {
    props: { country, flightInfo, countryName: context.params?.country },
    revalidate: 60 * 60 * 24, // refresh at most once a day,
  };
};
export default Country;

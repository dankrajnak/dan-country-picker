import { useRouter } from "next/router";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next/types";

export type Country = {
  name: string;
};

const COUNTRIES: Record<string, Country> = {
  mexico: { name: "Mexico" },
};

export const getRandomCountry = () => {
  const countries = Object.keys(COUNTRIES);
  return countries[Math.floor(Math.random() * countries.length)];
};

const Country = ({
  country,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <div className="text-white">You&apos;re in {country.name}</div>;
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
  return { props: { country } };
};
export default Country;

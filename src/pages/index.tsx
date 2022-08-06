import { useGLTF } from "@react-three/drei";
import type { NextPage } from "next";
import Link from "next/link";
import { forwardRef } from "react";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MutableRefObject,
  PropsWithChildren,
  RefObject,
  useId,
  useRef,
} from "react";
import { useRecoilState } from "recoil";
import CURRENT_USER_ATOM from "../atoms/currentUser.atom";
import { WORLD_PATH } from "../components/WorldModel";

import { getRandomCountry } from "../countries";
import useDiscount from "../hooks/useDiscount";

const Button = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => (
  <button
    {...props}
    className="inline-block mt-5 text-center border border-transparent rounded-md py-1 px-2 font-medium text-white bg-gray-800"
  >
    {props.children}
  </button>
);

// eslint-disable-next-line react/display-name
const Input = forwardRef<
  HTMLInputElement,
  { label: string; placeHolder: string }
>(({ label, placeHolder }, ref) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className="mt-1 relative rounded-md">
        <input
          id={id}
          type="text"
          autoComplete="off"
          ref={ref}
          className="focus:ring-gray-700 text-black focus:border-gray-700 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
          placeholder={placeHolder}
        />
      </div>
    </div>
  );
});

const Home: NextPage = () => {
  const [currentUser, setCurrentUser] = useRecoilState(CURRENT_USER_ATOM);
  const inputRef = useRef<HTMLInputElement>(null);
  const discount = useDiscount();
  return (
    <div className="relative bg-white w-full px-6 mt-10 pt-12 shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-16 ">
      <article className="prose prose-stone max-w-prose mx-auto">
        <h1 className="text-center">Application for Dan Visitation</h1>
        <p>
          We&apos;re looking for enthusiastic travellers to join Dan on his trip
          around the world. Do you have a love of travel and/or Dan? Join us in
          this exciting opportunity to see the world and Dan in it!
        </p>

        <div className="font-bold">Key Responsibilities:</div>
        <ul>
          <li>Be relatively happy to see Dan.</li>
          <li>Be comfortable spending an hour a day at a coffee shop.</li>
          <li>
            Be willing to listen to Dan talk about Javascript and be able to
            convince him that what he&apos;s saying is interesting and that,
            &ldquo;No, this is totally a good time to talk about this!&rdquo;
          </li>
        </ul>
        <p className="font-bold">Exceptional Candidates will have:</p>
        <ul>
          <li>Shared the womb with Dan.</li>
          <li>
            Forgiven Dan for any hospital trips he may have prompted while
            growing up.
          </li>
        </ul>

        <hr />
        <h2>Application</h2>

        <form
          autoComplete="off"
          className="flex flex-col space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("asdf");
            const name = inputRef.current?.value;
            if (name) {
              setCurrentUser({ name });
            }
          }}
        >
          <Input placeHolder="Dan" label="First Name" ref={inputRef} />
          <Input placeHolder="Krajank" label="Last Name" />
          {!currentUser && <Button type="submit">Submit</Button>}
        </form>

        {currentUser && (
          <div>
            Alright, cool. You&apos;re {currentUser.name}.
            {!!discount && <div> You have a {discount} discount.</div>}
            <Link href={"/world/" + getRandomCountry()}>
              <a className="inline-block mt-5 text-center border border-transparent rounded-md py-1 px-2 font-medium text-white bg-gray-800">
                Continue
              </a>
            </Link>
          </div>
        )}
        <div className="mt-4">
          <small className=" italic">
            Dan provides equal employment opportunities to all applicants and
            prohibits discrimination and harassment of any type without regard
            to race, color, religion, age, sex, national origin, disability
            status, genetics, protected veteran status, sexual orientation,
            gender identity or expression, or any other characteristic protected
            by federal, state or local laws.
          </small>
        </div>
      </article>
    </div>
  );
};

useGLTF.preload(WORLD_PATH);

export default Home;

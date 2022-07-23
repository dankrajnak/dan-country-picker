import type { NextPage } from "next";
import Link from "next/link";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import CURRENT_USER_ATOM from "../atoms/currentUser.atom";
import useDiscount from "../hooks/useDiscount";
import { getRandomCountry } from "./world/[country]";

const Home: NextPage = () => {
  const [currentUser, setCurrentUser] = useRecoilState(CURRENT_USER_ATOM);
  const inputRef = useRef<HTMLInputElement>(null);
  const discount = useDiscount();
  return (
    <>
      <div className="grid h-screen place-items-center text-white ">
        <div className="relative group w-2/5">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-600 bg-white rounded blur-lg opacity-75 "></div>
          <div className="relative px-12 py-10 bg-black rounded-lg leading-none divide-x divide-gray-600">
            <h1 className="text-2xl tracking-tight font-extrabold">
              Welcome to the{" "}
              <div className="tracking-tighter font-light">
                country-that-you-can-go-to-to-visit-dan-while-he&apos;s-travelling{" "}
              </div>
              picker
            </h1>

            <div className="mt-5">
              <label className="text-sm font-medium text-white ">Name</label>
              <div className="mt-1 relative rounded-md">
                <input
                  type="text"
                  name="name"
                  autoComplete="off"
                  ref={inputRef}
                  className="focus:ring-indigo-500 text-black focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="What's your name?"
                />
              </div>
            </div>

            {!currentUser && (
              <button
                onClick={() => {
                  const name = inputRef.current?.value;
                  if (name) {
                    setCurrentUser({ name });
                  }
                }}
                className="inline-block mt-5 text-center bg-gradient-to-r from-pink-400 to-purple-600 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-indigo-700"
              >
                Continue
              </button>
            )}
            {currentUser && (
              <div>
                Alright, cool. You&apos;re {currentUser.name}.
                {!!discount && <div> You have a {discount} discount.</div>}
                <Link href={"/world/" + getRandomCountry()}>
                  <a
                    onClick={() => {
                      const name = inputRef.current?.value;
                      if (name) {
                        setCurrentUser({ name });
                      }
                    }}
                    className="inline-block mt-5 text-center bg-gradient-to-r from-pink-400 to-purple-600 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-indigo-700"
                  >
                    Continue
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

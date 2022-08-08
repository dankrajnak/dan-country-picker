import { useGLTF } from "@react-three/drei";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef } from "react";
import { ButtonHTMLAttributes, DetailedHTMLProps, useId, useRef } from "react";
import { useRecoilState } from "recoil";
import CURRENT_USER_ATOM from "../atoms/currentUser.atom";
import { Button } from "../components/LinkButton";
import PaperLayout from "../components/PaperLayout";

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
  const router = useRouter();

  return (
    <PaperLayout>
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
            const name = inputRef.current?.value;
            if (name) {
              setCurrentUser({ name });
              router.push("/applicationSubmission");
            }
          }}
        >
          <Input placeHolder="Dan" label="First Name" ref={inputRef} />
          <Input placeHolder="Krajank" label="Last Name" />
          {!currentUser && <Button type="submit">Submit</Button>}
        </form>

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
    </PaperLayout>
  );
};

export default Home;

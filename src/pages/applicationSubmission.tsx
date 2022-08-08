import { useGLTF } from "@react-three/drei";
import Link from "next/link";
import { useMemo, useState } from "react";
import Confetti from "react-confetti";
import LinkButton from "../components/LinkButton";
import PaperLayout from "../components/PaperLayout";
import { ProcessRunner } from "../components/Process";
import { WORLD_PATH } from "../components/WorldModel";
import { getRandomCountry } from "../countries";
import useCurrentPerson from "../hooks/useCurrentPerson";
import useDiscount from "../hooks/useDiscount";
import { asCurrency } from "../utils";

const makeTimeoutPromise = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(() => res(), ms));

const makeTimeoutAction = (ms: number) => () => makeTimeoutPromise(ms);

const ApplicationSubmission = () => {
  const [isFinished, setIsFinished] = useState(false);
  const SUBMISSION_PROCESS = useMemo(
    () => [
      {
        step: {
          inProcessMessage: "Submitting Application",
          completedMessage: "Application Submitted",
        },
        action: makeTimeoutAction(4000),
      },
      {
        step: {
          inProcessMessage: "Processing Application",
          completedMessage: "Application Processed",
        },
        action: makeTimeoutAction(7000),
      },
      {
        step: {
          inProcessMessage: "Reviewing Application",
          completedMessage: "Application Accepted!",
        },
        action: async () => {
          await makeTimeoutPromise(15_000);
          setIsFinished(true);
        },
      },
    ],
    []
  );
  const user = useCurrentPerson();
  const discount = useDiscount();

  return (
    <>
      {isFinished && <Confetti />}
      <PaperLayout>
        <div className="prose mx-auto text-center">
          <>
            <h1>
              {user
                ? `Thank you for the application, ${user.name}`
                : "Thank you for the application."}
            </h1>
            <p>Give us one second while we get everything ready.</p>
            <div className="flex justify-center mt-10">
              <ProcessRunner process={SUBMISSION_PROCESS} />
            </div>
            {isFinished && (
              <>
                <h2 className="text-green-700">
                  {user ? `Congrats, ${user.name}.` : `Congrats!`}{" "}
                  {!!discount &&
                    `You are elligible for a ${asCurrency(
                      discount
                    )} scholarship!`}
                </h2>
                <Link href={"/world/" + getRandomCountry()}>
                  <LinkButton>Pick a random destination</LinkButton>
                </Link>
              </>
            )}
          </>
        </div>
      </PaperLayout>
    </>
  );
};

useGLTF.preload(WORLD_PATH);

export default ApplicationSubmission;

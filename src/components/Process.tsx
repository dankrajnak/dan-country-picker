import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useReducer } from "react";
import { TailSpin } from "react-loader-spinner";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export type Step = {
  inProcessMessage: string;
  completedMessage: string;
};

const Check = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const StepComp = ({ step, completed }: { step: Step; completed: boolean }) => (
  <>
    {completed ? (
      <motion.div
        key="icon-completed"
        className="text-green-700 flex justify-self-center self-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Check />
      </motion.div>
    ) : (
      <motion.div
        key="icon-loading"
        className="text-gray-600 flex justify-self-center self-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <TailSpin height={20} radius={5} color="black" />
      </motion.div>
    )}
    {completed ? (
      <motion.div
        key="message-completed"
        className={completed ? "text-green-700 " : "text-gray-600"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {step.completedMessage}
      </motion.div>
    ) : (
      <motion.div
        key="message-inprocess"
        className={completed ? "text-green-700 " : "text-gray-600"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {step.inProcessMessage}
      </motion.div>
    )}
  </>
);

type Props = {
  steps: Step[];
  currentStep: number;
  currentStepIsComplete?: boolean | null;
};

const Process = ({ currentStep, steps, currentStepIsComplete }: Props) => {
  if (currentStep < 0 || currentStep > steps.length) {
    return null;
  }
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key={currentStep}
      >
        <div className="grid gap-y-5 grid-cols-[40px_auto]">
          <StepComp
            key={currentStep}
            step={steps[currentStep]}
            completed={!!currentStepIsComplete}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

type State = { processIndex: number; currentProcessCompleted: boolean };

const INITIAL_STATE = { processIndex: 0, currentProcessCompleted: false };

type Action = "STEP_COMPLETED" | "NEXT_STEP";

const reducer = (state: State, action: Action): State => {
  switch (action) {
    case "STEP_COMPLETED":
      return {
        ...state,
        currentProcessCompleted: true,
      };
    case "NEXT_STEP":
      return {
        ...state,
        processIndex: state.processIndex + 1,
        currentProcessCompleted: false,
      };
    default:
      return state;
  }
};

export const ProcessRunner = ({
  process,
}: {
  process: { step: Step; action: () => Promise<unknown> }[];
}) => {
  const [{ currentProcessCompleted, processIndex }, dispatch] = useReducer(
    reducer,
    INITIAL_STATE
  );
  useEffect(() => {
    let onStep = true;
    process[processIndex].action().then(() => {
      if (onStep) {
        dispatch("STEP_COMPLETED");
      }
    });
    return () => {
      onStep = false;
    };
  }, [process, processIndex]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (currentProcessCompleted && processIndex < process.length - 1) {
      timeout = setTimeout(() => {
        if (currentProcessCompleted) {
          dispatch("NEXT_STEP");
        }
      }, 2000);
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [currentProcessCompleted, process.length, processIndex]);

  return (
    <Process
      steps={process.reduce((sum, cur) => [...sum, cur.step], [] as Step[])}
      currentStepIsComplete={currentProcessCompleted}
      currentStep={processIndex}
    />
  );
};

export default Process;

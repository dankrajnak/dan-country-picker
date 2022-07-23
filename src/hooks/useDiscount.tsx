import { useMemo } from "react";
import { CurrentUser } from "../atoms/currentUser.atom";
import useCurrentPerson from "./useCurrentPerson";

const PEOPLE_THAT_HAVE_DISCOUNTS: { names: string[]; discount: number }[] = [
  { names: ["Tom", "Tommy", "Thomas"], discount: 200 },
];

const getDiscountForPerson = ({ name }: CurrentUser): number => {
  const fountDiscount = PEOPLE_THAT_HAVE_DISCOUNTS.find((discount) =>
    discount.names
      .map((name) => name.toLocaleLowerCase())
      .includes(name.toLocaleLowerCase())
  );
  return fountDiscount ? fountDiscount.discount : 0;
};

const useDiscount = (): number => {
  const currentPerson = useCurrentPerson();
  return useMemo(() => {
    if (currentPerson) {
      return getDiscountForPerson(currentPerson);
    }
    return 0;
  }, [currentPerson]);
};

export default useDiscount;

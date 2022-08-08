import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
} from "react";

const className =
  "no-underline inline-block mt-5 text-center border border-transparent rounded-md py-1 px-2 font-medium text-white bg-gray-800";

export const Button = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => (
  <button {...props} className={className}>
    {props.children}
  </button>
);

const LinkButton = (
  props: DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
) => (
  <a {...props} className={className}>
    {props.children}
  </a>
);

export default LinkButton;

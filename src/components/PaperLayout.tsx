import { PropsWithChildren } from "react";

const PaperLayout = ({ children }: PropsWithChildren<{}>) => (
  <div className="relative bg-white w-full px-6 mt-10 pt-12 shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-16 ">
    {children}
  </div>
);

export default PaperLayout;

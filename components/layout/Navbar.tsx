import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Image from 'next/image';

type Props = {
  onMenuButtonClick(): void;
};
const Navbar = (props: Props) => {
  return (
    <nav
      className={classNames({
        "bg-white text-zinc-500": true, // colors
        "flex items-center": true, // layout
        "w-full fixed z-10 px-4 shadow-sm h-16": true, //positioning & styling
      })}
    >
      <Image src='icon-idol-monkey.png' alt='Idol Monkey' width='32' height='32' unoptimized />
      <div className="font-bold text-lg px-4">CotLI Tools</div>
      <div className="flex-grow"></div>
      <button className="md:hidden" onClick={props.onMenuButtonClick}>
        <Bars3Icon className="h-6 w-6" />
      </button>
    </nav>
  );
};

export default Navbar;

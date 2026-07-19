import { ReactNode, useEffect, useRef, useState } from "react";

import useBodyOverflow from "@hooks/useBodyOverflow";

import { cn } from "@helpers/cn";

import MaxContainer from "@components/Container/MaxContainer";
import ToastNotif from "@components/Toast";

import Header from "../Header";
import DNav from "../Nav/DNav";

export default function DLayout({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const { resetBodyOverflow, hideBodyOveflow } = useBodyOverflow();
  const openNav = () => {
    setIsNavOpen(true);
    hideBodyOveflow();
  };
  const closeNav = () => {
    setIsNavOpen(false);
    resetBodyOverflow();
  };

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        navRef.current &&
        logoRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !logoRef.current.contains(event.target as Node) &&
        isNavOpen
      ) {
        closeNav();
        resetBodyOverflow();
      }
    };

    document.addEventListener("pointerup", handleClickOutside);
    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [isNavOpen, resetBodyOverflow]);

  return (
    <MaxContainer>
      <div className="bg-background">
        <Header
          isNavOpen={isNavOpen}
          openNav={openNav}
          closeNav={closeNav}
          logoRef={logoRef}
        />
        <div className="grid grid-cols-[300px,_1fr] min-h-dashboard-content">
          <DNav isNavOpen={isNavOpen} closeNav={closeNav} navRef={navRef} />
          <div
            className={cn(
              "col-start-2 relative col-end-3 px-4 lg:col-start-1 pb-16 isolate h-full"
            )}
          >
            {isNavOpen && <div className="inset-0 absolute bg-black/30 z-10" />}
            <div className="max-w-3xl mx-auto mt-12 h-full md:mt-10">
              {children}
            </div>
          </div>
        </div>
        <ToastNotif />
      </div>
    </MaxContainer>
  );
}

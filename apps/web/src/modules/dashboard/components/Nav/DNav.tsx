import { NavLink, useLocation, useParams } from "react-router-dom";

import { cn } from "@helpers/cn";
import getSVGFromString from "@helpers/getSVGFromString";

import { NavOpenPropsType } from "../../types";

export const navLinksArray = [
  {
    id: 1,
    text: "Overview",
    icon: "overview",
    to: "",
  },
  {
    id: 2,
    text: "Upcoming Birthdays",
    icon: "calender",
    to: "upcoming-birthdays",
  },
  {
    id: 3,
    text: "Feedback",
    icon: "settings",
    to: "feedback",
  },
];

function normalizePath(path: string) {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : "/";
}

export default function DNav({
  isNavOpen,
  closeNav,
  navRef,
}: NavOpenPropsType) {
  const { userId } = useParams();
  const { pathname } = useLocation();
  const currentPath = normalizePath(pathname);

  return (
    <div
      className={cn(
        "col-span-1 transition sticky top-16 backdrop-blur bg-white/80 lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:w-[250px] h-dashboard-content lg:mt-16 isolate lg:z-10 lg:border-0",
        {
          "lg:-translate-x-full": !isNavOpen,
        }
      )}
      ref={navRef}
    >
      <nav className="py-8 flex flex-col justify-between">
        <ul className="flex flex-col space-y-2">
          {navLinksArray.map(({ id, to, icon, text }) => {
            const href = normalizePath(`/dashboard/${userId}/${to}`);
            const isActive = currentPath === href;

            return (
              <li key={id}>
                <NavLink
                  to={href}
                  end
                  className={({ isPending }) =>
                    cn(
                      "grid grid-flow-col items-center justify-start gap-3 px-4 py-2 text-foreground relative before:absolute before:w-1 before:h-full before:bg-transparent outline-none focus-ring-visible focus-visible:ring-offset-0",
                      {
                        "bg-accent/10 before:bg-accent": isActive,
                        "animate-pulse": isPending,
                        "hover:bg-accent/10": !isActive,
                      }
                    )
                  }
                  onClick={closeNav}
                >
                  {getSVGFromString(icon, 16, 16)}
                  <span>{text}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

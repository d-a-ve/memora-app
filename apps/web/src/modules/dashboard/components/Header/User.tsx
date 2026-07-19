import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import useBodyOverflow from "@hooks/useBodyOverflow";
import { useUserQuery } from "@hooks/useUserQuery";

import { getInitials } from "@api/avatar";

import { cn } from "@helpers/cn";

import LogoutModal from "../Logout/LogoutModal";

export default function User() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { hideBodyOveflow, resetBodyOverflow } = useBodyOverflow();
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
    setIsProfileModalOpen(false);
    hideBodyOveflow();
  };
  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
    resetBodyOverflow();
  };
  const toggleProfileModal = () => {
    setIsProfileModalOpen((prev) => !prev);
  };

  const { userId } = useParams();
  const { data: currentUser, isLoading: isCurrentUserLoading } = useUserQuery();
  const userAvatar = getInitials(currentUser?.name);

  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        userRef.current &&
        !userRef.current.contains(event.target as Node) &&
        isProfileModalOpen
      ) {
        toggleProfileModal();
      }
    };

    document.addEventListener("pointerup", handleClickOutside);
    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [isProfileModalOpen]);

  return (
    <>
      <div className="relative w-fit isolate" ref={userRef}>
        <button
          className="flex items-center gap-x-2 outline-none focus-ring-visible focus-visible:ring-offset-0"
          onClick={toggleProfileModal}
        >
          <span className="w-8 h-8 bg-white overflow-hidden rounded-full flex items-center justify-center sm:w-6 sm:h-6">
            <img
              src={userAvatar.href}
              alt={`${currentUser?.name || "Guest"} initials`}
              className="w-full h-full object-cover object-center"
            />
          </span>
          <p className="flex items-center gap-x-1 text-base md:text-fs--1 sm:text-fs--2">
            {!isCurrentUserLoading && <span>{currentUser?.name || ""}</span>}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={cn("w-3 h-3 transition-all", {
                "rotate-180": isProfileModalOpen,
              })}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </p>
        </button>
        <div
          className={cn(
            "absolute w-full -bottom-28 left-0 bg-white rounded z-1 border border-gray-200 transition-all",
            {
              "-translate-y-1/2 opacity-0 invisible": !isProfileModalOpen,
            }
          )}
        >
          <nav>
            <ul className="px-2 py-2.5 space-y-2 text-black text-left">
              <li>
                <Link
                  className="px-2 py-1 hover:rounded hover:bg-accent/20 focus-ring-visible block"
                  to={`/dashboard/${userId}/profile`}
                  onClick={toggleProfileModal}
                >
                  Profile
                </Link>
              </li>
              <li
                aria-hidden="true"
                className="border-t border-t-gray-200"
              ></li>
              <li>
                <button
                  className="px-2 py-1 hover:rounded hover:bg-accent/20 focus-ring-visible block w-full text-left"
                  onClick={openLogoutModal}
                >
                  Log out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {isLogoutModalOpen && (
        <LogoutModal
          modal={{ isOpen: isLogoutModalOpen, close: closeLogoutModal }}
        />
      )}
    </>
  );
}

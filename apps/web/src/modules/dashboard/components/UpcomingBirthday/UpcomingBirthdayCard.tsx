import { ElementRef, useEffect, useRef, useState } from "react";

import useEditBirthdayMutation from "@modules/dashboard/hooks/useEditBirthdayMutation";

import useBodyOverflow from "@hooks/useBodyOverflow";

import { getInitials } from "@api/avatar";

import { cn } from "@helpers/cn";
import {
  getDateFromDateString,
  getDateFromSlashSeparatedString,
  getDaysLeft,
} from "@helpers/getDate";

import DeleteBirthdayModal from "../DeleteBirthday/DeleteBirthdayModal";
import EditBirthdayModal from "../EditBirthday/EditBirthdayModal";

type OptionsType = "edit" | "delete";

export function UpcomingBirthdayCard({
  name,
  birthday,
  docId,
}: {
  name: string;
  birthday: string;
  docId: string;
}) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [options, setOptions] = useState<OptionsType | null>(null);
  const buttonRef = useRef<ElementRef<"button">>(null);
  const { mutationVariables } = useEditBirthdayMutation();
  const { hideBodyOveflow, resetBodyOverflow } = useBodyOverflow();

  const openSelectedOptionsModal = (opt: OptionsType) => {
    setOptions(opt);
    hideBodyOveflow();
  };
  const closeSelectedOptionsModal = () => {
    setOptions(null);
    resetBodyOverflow();
  };

  const { day, monthName } = getDateFromDateString(birthday);
  const timeLeft = getDaysLeft(birthday);
  const initials = getInitials(name);

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        isOptionsOpen
      ) {
        setIsOptionsOpen(false);
      }
    };

    document.addEventListener("pointerup", handleClickOutside);
    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
    };
  }, [isOptionsOpen]);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 text-fs--1 py-2 b-accent px-3",
        {
          "bg-accent text-background rounded-md": timeLeft === "Today 🎉",
          "animate-pulse":
            mutationVariables.length > 0 &&
            mutationVariables[0].docId === docId,
        }
      )}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-background">
          <img src={initials.href} alt={`${name} initials`} />
        </div>
        <div className="ml-3">
          <p className="font-semibold leading-tight mb-1">{name}</p>
          <p>
            <span className="text-fs-1">{day}</span>.{monthName}
          </p>
        </div>
      </div>

      <div className="flex gap-x-4 items-center sm:flex-col-reverse sm:items-end">
        <p className="capitalize font-medium text-right">{timeLeft}</p>
        <button
          type="button"
          className="grow-0 shrink-0 text-foreground outline-none relative rounded focus-ring-visible hover:bg-primary/20"
          onClick={() => setIsOptionsOpen((prev) => !prev)}
          ref={buttonRef}
        >
          <svg
            className="text-currentColor w-4.5 h-4.5"
            data-testid="geist-icon"
            fill="none"
            height="20"
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width="24"
          >
            <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
            <circle cx="19" cy="12" r="1" fill="currentColor"></circle>
            <circle cx="5" cy="12" r="1" fill="currentColor"></circle>
          </svg>
          {isOptionsOpen && (
            <ul className="absolute w-fit right-0 p-1 bg-white rounded border border-gray-300 z-1 text-left">
              <li>
                <span
                  className="block px-2 py-1 w-full text-left outline-none rounded hover:bg-primary/20 focus-ring-visible focus-visible:rounded focus-visible:ring-offset-0"
                  onClick={() => openSelectedOptionsModal("edit")}
                  tabIndex={0}
                >
                  Edit
                </span>
              </li>
              <li>
                <span
                  className="block text-red-500 px-2 py-1 rounded outline-none hover:text-white hover:bg-red-500 focus-ring-visible focus-visible:ring-offset-0"
                  onClick={() => openSelectedOptionsModal("delete")}
                  tabIndex={0}
                >
                  Delete
                </span>
              </li>
            </ul>
          )}
        </button>
      </div>

      {options === "edit" && (
        <EditBirthdayModal
          modal={{
            isOpen: options === "edit",
            close: closeSelectedOptionsModal,
          }}
          oldValue={{ name, birthday }}
          docId={docId}
        />
      )}

      {options === "delete" && (
        <DeleteBirthdayModal
          modal={{
            isOpen: options === "delete",
            close: closeSelectedOptionsModal,
          }}
          docId={docId}
        />
      )}
    </div>
  );
}

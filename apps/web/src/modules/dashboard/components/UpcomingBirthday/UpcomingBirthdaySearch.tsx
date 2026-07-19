import {
  Dispatch,
  SetStateAction, // FormEvent,
  useEffect,
  useState, // FormEvent,
} from "react";

import useDebounce from "@hooks/useDebounce";
import { useUserQuery } from "@hooks/useUserQuery";

import { searchForBirthday } from "@api/birthdays";

import getSVGFromString from "@helpers/getSVGFromString";

import { birthdayDataType } from "@myTypes/index";

import { Input } from "@components/Input/Input";

export function UpcomingBirthdaySearch({
  setSearchedBirthday,
  setIsSearching,
}: {
  setSearchedBirthday: Dispatch<SetStateAction<birthdayDataType | undefined>>;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
}) {
  const { data } = useUserQuery();
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce<string>(searchValue);

  useEffect(() => {
    if (searchValue.length > 0) {
      setIsSearching(true);
    }
  }, [searchValue]);

  useEffect(() => {
    const searchBirthdays = async () => {
      if (!data?.$id) {
        setIsSearching(false);
        return;
      }

      const birthdays = await searchForBirthday({
        name: debouncedValue,
        userId: data?.$id,
      });

      setSearchedBirthday(birthdays);
      setIsSearching(false);
    };

    searchBirthdays();
  }, [debouncedValue, setSearchedBirthday, data?.$id]);

  return (
    <div>
      <form className="flex gap-1 relative">
        <Input
          inputType="text"
          inputValue={searchValue}
          changeHandler={(e) => setSearchValue(e.target.value)}
          required={false}
          labelFor="searchBirthday"
          placeHolder="Search..."
          className="search-input"
        />
        {searchValue.length > 0 && (
          <button
            className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer outline-none focus-ring-visible focus-visible:rounded"
            title="Clear search input"
            onClick={() => {
              setSearchValue("");
              setIsSearching(true);
            }}
          >
            {getSVGFromString("close", 12, 12)}
          </button>
        )}
      </form>
    </div>
  );
}

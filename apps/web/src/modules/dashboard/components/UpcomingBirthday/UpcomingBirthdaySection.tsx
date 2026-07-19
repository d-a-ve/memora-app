import { useState } from "react";

import useAddBirthdayMutation from "@modules/dashboard/hooks/useAddBirthdayMutation";

import filterUpcomingBirthdaysFromCurrentDate from "@helpers/filterUpcomingBirthdays";
import { getDateFromSlashSeparatedString } from "@helpers/getDate";

import { birthdayDataType } from "@myTypes/index";

import { LinkButton } from "@components/Link";
import { InlineLoader } from "@components/Loader";

import CardSectionLayout from "../Layout/CardSectionLayout";
import { UpcomingBirthdayCard } from "./UpcomingBirthdayCard";
import { UpcomingBirthdaySearch } from "./UpcomingBirthdaySearch";

type ShowMoreBirthdays = {
  numOfBirthdaysToShow: number;
  linkToSeeMoreBirthdays: string;
};

type UpcomingBirthdaySectionProps = {
  birthdays: birthdayDataType | undefined;
  showMoreBirthdays?: ShowMoreBirthdays;
};

export function UpcomingBirthdaySection({
  birthdays,
  showMoreBirthdays,
}: UpcomingBirthdaySectionProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchedBirthday, setSearchedBirthday] = useState<birthdayDataType>();
  const filteredBirthdays = filterUpcomingBirthdaysFromCurrentDate(
    birthdays?.documents
  );
  const filteredSearchedBirthdays = filterUpcomingBirthdaysFromCurrentDate(
    searchedBirthday?.documents
  );

  const { mutationVariables } = useAddBirthdayMutation();
  // If the number of searched birthdays is greater than the number of birthdays to show, show the "See more birthdays" link
  const shouldSeeMoreSearchedBirthdaysLinkShow =
    filteredSearchedBirthdays &&
    showMoreBirthdays &&
    filteredSearchedBirthdays.length > showMoreBirthdays.numOfBirthdaysToShow;

  const shouldSeeMoreBirthdaysLinkShow =
    filteredBirthdays &&
    showMoreBirthdays &&
    filteredBirthdays.length > showMoreBirthdays.numOfBirthdaysToShow;
  return (
    <CardSectionLayout>
      <section>
        <div className="mb-4 mt-2 flex items-center justify-between sm:flex-col sm:gap-2 sm:items-start">
          <h2 className="font-semibold text-fs-1 sm:mb-1">
            Upcoming Birthdays
          </h2>
          <div className="sm:w-full">
            <UpcomingBirthdaySearch
              setSearchedBirthday={setSearchedBirthday}
              setIsSearching={setIsSearching}
            />
          </div>
        </div>
        {isSearching && (
          <div className="fill-primary text-background flex justify-center py-6">
            <InlineLoader />
          </div>
        )}
        {!isSearching && (
          <div>
            <div>
              {/* to optimistically show new birthday added to the list immediately */}
              {mutationVariables.length > 0 && (
                <div className="opacity-50">
                  <UpcomingBirthdayCard
                    key={mutationVariables[0].name[1] as string}
                    docId={mutationVariables[0].name[1] as string}
                    name={mutationVariables[0].name[1] as string}
                    birthday={`${getDateFromSlashSeparatedString(
                      mutationVariables[0].birthdayDate[1] as string
                    )}`}
                  />
                </div>
              )}

              {/* When user is searching, map using the searchedBirthdays instead of default birthdays */}
              {(filteredSearchedBirthdays || filteredBirthdays)
                ?.slice(
                  0,
                  // if undefined, show all birthdays
                  showMoreBirthdays && showMoreBirthdays.numOfBirthdaysToShow
                )
                ?.map((doc, i, arr) => {
                  return (
                    <div key={doc.$id}>
                      <UpcomingBirthdayCard
                        docId={doc.$id}
                        name={doc.person_name}
                        birthday={doc.person_birthday}
                      />
                      {arr.length - 1 !== i && (
                        <div
                          aria-hidden="true"
                          className="w-full my-3 h-[1px] bg-gray-200"
                        ></div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* If no birthdays are found when searching, show this message */}
            {filteredSearchedBirthdays &&
              filteredSearchedBirthdays.length === 0 && (
                <div>No birthdays found after searching</div>
              )}

            {/* If no birthdays are found, show this message */}
            {filteredBirthdays && filteredBirthdays.length === 0 && (
              <div>No birthdays found</div>
            )}

            {(shouldSeeMoreSearchedBirthdaysLinkShow ||
              shouldSeeMoreBirthdaysLinkShow) && (
              <p className="mt-8 text-center text-white">
                <LinkButton
                  className="text-fs--1"
                  href={showMoreBirthdays.linkToSeeMoreBirthdays}
                  label="See more birthdays..."
                />
              </p>
            )}
          </div>
        )}
      </section>
    </CardSectionLayout>
  );
}

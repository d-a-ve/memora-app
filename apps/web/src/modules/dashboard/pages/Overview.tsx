import { useParams } from "react-router-dom";

import { listUserDocFromBirthdaysCol } from "@api/birthdays";

import { PageLoader } from "@components/Loader";

import AddBirthday from "../components/AddBirthday/AddBirthday";
import { DashboardBirthdayCalender } from "../components/Calender/DashboardBirthdayCalender";
import EmptyBirthdayState from "../components/EmptyBirthdayState/EmptyBirthdayState";
import { UpcomingBirthdaySection } from "../components/UpcomingBirthday/UpcomingBirthdaySection";
import { useBirthdayQuery } from "../hooks/useBirthdayQuery";

export default function Overview() {
  const { userId } = useParams();
  const {
    data: birthdays,
    isLoading: isBirthdaysLoading,
    error: birthdaysError,
  } = useBirthdayQuery({
    queryFn: () => listUserDocFromBirthdaysCol(userId),
    queryKey: ["birthdays", userId],
    refetchOnWindowFocus: false,
  });

  if (isBirthdaysLoading) return <PageLoader />;

  if (birthdaysError) return <div>Something went wrong!!</div>;

  if (birthdays?.documents.length === 0) return <EmptyBirthdayState />;

  return (
    <>
      <div className="mb-6">
        <DashboardBirthdayCalender birthdays={birthdays} />
      </div>

      <UpcomingBirthdaySection
        birthdays={birthdays}
        showMoreBirthdays={{
          numOfBirthdaysToShow: 10,
          linkToSeeMoreBirthdays: `/dashboard/${userId}/upcoming-birthdays`,
        }}
      />
      <AddBirthday showMode={{ mode: "button" }} />
    </>
  );
}

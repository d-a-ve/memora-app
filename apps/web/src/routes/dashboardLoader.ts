import { LoaderFunctionArgs } from "react-router-dom";

import { listUserDocFromBirthdaysCol } from "@api/birthdays";

export async function dashboardLoader({ params }: LoaderFunctionArgs) {
  const user = await listUserDocFromBirthdaysCol(
    params.userId
    // params.queryLimit
  );
  return user;
}

import { useUserQuery } from "@hooks/useUserQuery";

import { LinkButton } from "@components/Link";

function LandingButton() {
  const { data } = useUserQuery();

  return (
    <>
      {data ? (
        <LinkButton
          href={`/dashboard/${data.$id}`}
          label="Go to dashboard"
          size="sm"
        />
      ) : (
        <LinkButton href="/login" label="Get Started" size="sm" />
      )}
    </>
  );
}

export default LandingButton;

import MaxContainer from "@components/Container/MaxContainer";
import { NormalLink } from "@components/Link";
import { FullNameLogo } from "@components/Logo";

function Error404Page() {
  return (
    <MaxContainer>
      <div className="absolute top-8 left-4 w-28">
        <FullNameLogo />
      </div>
      <div className="bg-background min-h-screen grid place-items-center">
        <div className="max-w-lg text-center space-">
          <h1 className="text-9xl font-bold flex items-center justify-center mb-8">
            4
            <span>
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 11 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-8xl"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.86808 12.8681C7.14839 12.2436 11 9.44956 11 5.5C11 2.46243 8.53757 0 5.5 0C2.46243 0 0 2.46243 0 5.5C0 9.44956 3.85161 12.2436 5.13192 12.8681L4.42678 13.5732C4.26929 13.7307 4.38083 14 4.60355 14H6.39645C6.61917 14 6.73071 13.7307 6.57322 13.5732L5.86808 12.8681Z"
                  fill="var(--accent)"
                />
              </svg>
            </span>
            4
          </h1>
          <p className="text-fs-1 font-medium mb-4">
            We could not connect the dots.
          </p>
          <p className="mb-4">
            The page could not be found. You could have mistyped the address or
            the page may have moved.
          </p>
          <NormalLink href="/" label="Take me to the home page" />
        </div>
      </div>
    </MaxContainer>
  );
}

export default Error404Page;

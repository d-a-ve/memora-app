export function InlineLoader() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-4 h-4 text-current animate-spin fill-inherit"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="bg-background flex items-center justify-center w-full h-screen text-foreground">
      <p className="text-2xl font-bold flex items-center tracking-widest">
        L
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 11 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-lg animate-spin"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.86808 12.8681C7.14839 12.2436 11 9.44956 11 5.5C11 2.46243 8.53757 0 5.5 0C2.46243 0 0 2.46243 0 5.5C0 9.44956 3.85161 12.2436 5.13192 12.8681L4.42678 13.5732C4.26929 13.7307 4.38083 14 4.60355 14H6.39645C6.61917 14 6.73071 13.7307 6.57322 13.5732L5.86808 12.8681Z"
            fill="var(--accent)"
          />
        </svg>
        ading...
      </p>
    </div>
  );
}

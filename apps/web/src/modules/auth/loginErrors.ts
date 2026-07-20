const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  oauth_state:
    "Google sign-in was cancelled or could not be verified. Please try again.",
  oauth: "Google sign-in failed. Please try again.",
  oauth_token:
    "We could not complete Google sign-in. Please try again in a moment.",
  oauth_profile:
    "We could not load your Google account details. Please try again.",
};

export function getLoginErrorMessage(errorCode: string): string {
  return (
    LOGIN_ERROR_MESSAGES[errorCode] ??
    "Something went wrong during sign-in. Please try again."
  );
}

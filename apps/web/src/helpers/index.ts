export function extractErrorMessage(message: string) {
  return message
    .replace(/^AppwriteException:\s*/i, "")
    .replace(/^Error:\s*/i, "");
}

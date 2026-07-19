const BASE_URL =
  import.meta.env.VITE_PROD_URL || import.meta.env.VITE_DEV_URL || "";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export { BASE_URL, API_URL };

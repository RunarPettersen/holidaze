export const ENV = {
  API_BASE: import.meta.env.VITE_API_BASE as string,
  API_KEY: import.meta.env.VITE_API_KEY as string,
};

if (!ENV.API_BASE) console.warn("Missing VITE_API_BASE");
if (!ENV.API_KEY) console.warn("Missing VITE_API_KEY");
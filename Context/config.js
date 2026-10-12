// The only place the frontend reads environment variables. Next.js inlines
// NEXT_PUBLIC_ values at build time, so each one is referenced literally.
import { networks } from "./networks";

const required = (name, value) => {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and set it.`
    );
  }
  return value.trim();
};

export const CONTRACT_ADDRESS = required(
  "NEXT_PUBLIC_CONTRACT_ADDRESS",
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
);

export const NETWORK_NAME = required(
  "NEXT_PUBLIC_NETWORK",
  process.env.NEXT_PUBLIC_NETWORK
);

if (!/^0x[0-9a-fA-F]{40}$/.test(CONTRACT_ADDRESS)) {
  throw new Error(
    `NEXT_PUBLIC_CONTRACT_ADDRESS is not an address: ${CONTRACT_ADDRESS}`
  );
}

if (!networks[NETWORK_NAME]) {
  throw new Error(
    `NEXT_PUBLIC_NETWORK must be one of: ${Object.keys(networks).join(", ")}`
  );
}

export const NETWORK = networks[NETWORK_NAME];

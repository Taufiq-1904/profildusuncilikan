// NOTE: credentials are hardcoded here as plaintext for prototype purposes,
// same as the previous implementation. This is not safe for a real public
// deployment — a real backend with hashed passwords and server-side session
// verification is needed before launch. Flagged for a later phase.

export type Role = "dusun" | "rw" | "rt";

export type AppUser = {
  username: string;
  password: string;
  displayName: string;
  role: Role;
  // "dusun" for the dusun-level account, an RW id (e.g. "rw09") for RW
  // accounts, or an RT id (e.g. "rt01") for RT accounts.
  wilayahId: string;
};

export const accounts: AppUser[] = [
  {
    username: "admin",
    password: "cilikan2024",
    displayName: "Admin Dusun Cilikan",
    role: "dusun",
    wilayahId: "dusun",
  },
  {
    username: "rw09",
    password: "rw09cilikan",
    displayName: "Ketua RW 09",
    role: "rw",
    wilayahId: "rw09",
  },
  {
    username: "rw10",
    password: "rw10cilikan",
    displayName: "Ketua RW 10",
    role: "rw",
    wilayahId: "rw10",
  },
  {
    username: "rt01",
    password: "rt01cilikan",
    displayName: "Ketua RT 01",
    role: "rt",
    wilayahId: "rt01",
  },
  {
    username: "rt02",
    password: "rt02cilikan",
    displayName: "Ketua RT 02",
    role: "rt",
    wilayahId: "rt02",
  },
  {
    username: "rt03",
    password: "rt03cilikan",
    displayName: "Ketua RT 03",
    role: "rt",
    wilayahId: "rt03",
  },
  {
    username: "rt04",
    password: "rt04cilikan",
    displayName: "Ketua RT 04",
    role: "rt",
    wilayahId: "rt04",
  },
];

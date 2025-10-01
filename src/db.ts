import Dexie, { type EntityTable } from "dexie";
import { DATABASE_NAME, DATABASE_VERSION } from "./config";

interface Test {
  id: number;
}

const db = new Dexie(DATABASE_NAME) as Dexie & {
  symptoms: EntityTable<Test, "id">;
};

// Declare Schema
db.version(DATABASE_VERSION).stores({
  symptoms: "++id",
});

// Exports
export type { Test };
export { db };

import Dexie, { type EntityTable } from "dexie";
import { DATABASE_NAME, DATABASE_VERSION } from "./config";
import { type SymptomRecord } from "./interfaces/SymptomRecord";

// Instantiate db
const db = new Dexie(DATABASE_NAME) as Dexie & {
  symptoms: EntityTable<SymptomRecord, "id">;
};

// Declare Schema
db.version(DATABASE_VERSION).stores({
  symptoms: "++id, timestamp, type, location, pollenData",
});

// Exports
export { db };

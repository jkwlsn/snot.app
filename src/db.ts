import Dexie, { type EntityTable } from "dexie";
import { DATABASE_NAME, DATABASE_VERSION } from "./config";
import { type Symptom } from "./interfaces/symptom";

// Instantiate db
const db = new Dexie(DATABASE_NAME) as Dexie & {
  symptoms: EntityTable<Symptom, "id">;
};

// Declare Schema
db.version(DATABASE_VERSION).stores({
  symptoms: "++id, timestamp, type",
});

// Exports
export { db };

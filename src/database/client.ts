import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const sqliteDatabase = openDatabaseSync("my-tennis-stats.db");

sqliteDatabase.execSync("PRAGMA foreign_keys = ON;");

export const database = drizzle(sqliteDatabase);

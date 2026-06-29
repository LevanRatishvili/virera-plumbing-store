import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const defaultDataDir = join(projectRoot, "data");

function configuredPath(value, fallback) {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  return isAbsolute(raw) ? raw : resolve(projectRoot, raw);
}

const dataDirConfigured = Boolean(String(process.env.DATA_DIR || "").trim());
const databasePathConfigured = Boolean(String(process.env.DATABASE_PATH || process.env.SQLITE_PATH || "").trim());
const mediaUploadDirConfigured = Boolean(String(process.env.MEDIA_UPLOAD_DIR || "").trim());
const mediaUploadRequested = String(process.env.MEDIA_UPLOAD_ENABLED || "").trim().toLowerCase() === "true";

const dataDir = configuredPath(process.env.DATA_DIR, defaultDataDir);
const databasePath = configuredPath(process.env.DATABASE_PATH || process.env.SQLITE_PATH, join(dataDir, "store.sqlite"));
const mediaUploadDir = configuredPath(process.env.MEDIA_UPLOAD_DIR, join(dataDir, "uploads"));
const mediaUploadEnabled = mediaUploadRequested && mediaUploadDirConfigured;

mkdirSync(dataDir, { recursive: true });
mkdirSync(dirname(databasePath), { recursive: true });
if (mediaUploadEnabled) mkdirSync(mediaUploadDir, { recursive: true });

export const storageConfig = {
  projectRoot,
  dataDir,
  databasePath,
  mediaUploadDir,
  dataDirConfigured,
  databasePathConfigured,
  databasePathSource: databasePathConfigured ? "env" : "default",
  mediaUploadRequested,
  mediaUploadDirConfigured,
  mediaUploadEnabled,
  mediaUploadPathSource: mediaUploadDirConfigured ? "env" : "default",
  persistentStorageWarning: process.env.NODE_ENV === "production" && (!dataDirConfigured || !databasePathConfigured)
};

export function publicStorageDiagnostics() {
  return {
    dataDirConfigured: storageConfig.dataDirConfigured,
    databasePathSource: storageConfig.databasePathSource,
    mediaUploadEnabled: storageConfig.mediaUploadEnabled,
    mediaUploadRequested: storageConfig.mediaUploadRequested,
    mediaUploadDirConfigured: storageConfig.mediaUploadDirConfigured,
    mediaUploadPathSource: storageConfig.mediaUploadPathSource,
    persistentStorageWarning: storageConfig.persistentStorageWarning
  };
}

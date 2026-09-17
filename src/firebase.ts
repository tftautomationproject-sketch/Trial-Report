import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore,
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { TrialReport, AppConfig } from './types';
import { INITIAL_REPORTS, DEFAULT_APP_CONFIG } from './mockData';
import { optimizeReportImagesForFirestore, compressBase64Image } from './utils/imageCompressor';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Initialize Firestore with reliable long-polling transport.
 * This prevents "@firebase/firestore: Could not reach Cloud Firestore backend / [code=unavailable]"
 * errors that occur when WebChannel streaming or WebSockets are buffered in sandbox iframes and reverse proxies.
 */
function createFirestoreInstance() {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId || undefined
    );
  } catch {
    // If instance was already created with settings, retrieve it
    return firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
}

export const db = createFirestoreInstance();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: true,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const REPORTS_COLLECTION = 'trial_reports';
const CONFIG_COLLECTION = 'app_config';
const MAIN_CONFIG_DOC = 'main_config';

/**
 * Validate Firestore connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase configuration notice: client operating in offline mode.');
    }
    return false;
  }
}

/**
 * Subscribe to real-time reports stream
 */
export function subscribeToReports(
  onUpdate: (reports: TrialReport[]) => void,
  onError?: (error: Error) => void
) {
  const reportsRef = collection(db, REPORTS_COLLECTION);
  const q = query(reportsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is completely empty on first launch, seed with initial mock data
        console.log('No reports in Firestore, seeding initial sample reports...');
        try {
          await seedInitialReports();
        } catch (e) {
          console.warn('Initial seeding note:', e);
        }
        return;
      }

      const items: TrialReport[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as TrialReport), id: docSnap.id });
      });
      onUpdate(items);
    },
    (err) => {
      console.warn('Firestore reports subscription notice:', err.message);
      if (err.code === 'permission-denied' || err.message.includes('insufficient permissions')) {
        handleFirestoreError(err, OperationType.LIST, REPORTS_COLLECTION);
      }
      if (onError) onError(err);
    }
  );
}

/**
 * Subscribe to app config (company name, logo, defaults)
 */
export function subscribeToConfig(
  onUpdate: (config: AppConfig) => void
) {
  const docRef = doc(db, CONFIG_COLLECTION, MAIN_CONFIG_DOC);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as AppConfig);
      } else {
        // Initialize default config if not present
        setDoc(docRef, DEFAULT_APP_CONFIG).catch((err) => {
          console.warn('Default config write note:', err);
        });
        onUpdate(DEFAULT_APP_CONFIG);
      }
    },
    (err) => {
      console.warn('Firestore config subscription notice:', err.message);
      if (err.code === 'permission-denied' || err.message.includes('insufficient permissions')) {
        handleFirestoreError(err, OperationType.GET, `${CONFIG_COLLECTION}/${MAIN_CONFIG_DOC}`);
      }
    }
  );
}

/**
 * Recursively cleans objects for Firestore:
 * - Converts `undefined` values to `null` so Firestore setDoc/updateDoc never fails with
 *   "Unsupported field value: undefined"
 * - Cleans arrays by filtering out undefined or transforming nested elements
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as unknown as T;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value === undefined) {
      result[key] = null;
    } else {
      result[key] = sanitizeForFirestore(value);
    }
  }
  return result as T;
}

/**
 * Save or update a trial report to Firestore.
 * Automatically downscales and compresses high-resolution images to guarantee
 * document size never exceeds Cloud Firestore's 1MB limit.
 */
export async function saveReportToFirestore(report: TrialReport): Promise<void> {
  const path = `${REPORTS_COLLECTION}/${report.id}`;
  const docRef = doc(db, REPORTS_COLLECTION, report.id);

  // Compress and optimize base64 images so total document size is well below 1MB
  let optimizedReport = report;
  try {
    optimizedReport = await optimizeReportImagesForFirestore(report);
  } catch (optErr) {
    console.warn('Image optimization skipped or encountered an error:', optErr);
  }

  const dataToSave = sanitizeForFirestore({
    ...optimizedReport,
    updatedAt: new Date().toISOString()
  });

  try {
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('insufficient permissions')) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    throw err;
  }
}

/**
 * Delete a report from Firestore
 */
export async function deleteReportFromFirestore(reportId: string): Promise<void> {
  const path = `${REPORTS_COLLECTION}/${reportId}`;
  const docRef = doc(db, REPORTS_COLLECTION, reportId);
  try {
    await deleteDoc(docRef);
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('insufficient permissions')) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
    throw err;
  }
}

/**
 * Save application configuration
 */
export async function saveConfigToFirestore(config: AppConfig): Promise<void> {
  const path = `${CONFIG_COLLECTION}/${MAIN_CONFIG_DOC}`;
  const docRef = doc(db, CONFIG_COLLECTION, MAIN_CONFIG_DOC);

  let configToSave = { ...config };
  if (configToSave.logoUrl && configToSave.logoUrl.startsWith('data:')) {
    try {
      configToSave.logoUrl = await compressBase64Image(configToSave.logoUrl, 400, 400, 0.8);
    } catch {
      // keep original
    }
  }

  const dataToSave = sanitizeForFirestore(configToSave);
  try {
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('insufficient permissions')) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    throw err;
  }
}

/**
 * Seed initial sample reports if database is empty
 */
async function seedInitialReports(): Promise<void> {
  const batchPromises = INITIAL_REPORTS.map((report) => {
    const docRef = doc(db, REPORTS_COLLECTION, report.id);
    const dataToSave = sanitizeForFirestore({
      ...report,
      createdAt: report.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return setDoc(docRef, dataToSave, { merge: true });
  });
  await Promise.all(batchPromises);
}

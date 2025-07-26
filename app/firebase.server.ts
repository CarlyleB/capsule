import {
  App,
  initializeApp,
  getApps,
  cert,
  getApp,
  ServiceAccount,
} from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";

const firebaseCertPath = process.env.FIREBASE_CERT_PATH;
if (!firebaseCertPath) {
  throw new Error("Must set FIREBASE_CERT_PATH env var");
}

const certificateModule = await import(/* @vite-ignore */ firebaseCertPath);
const certificate = { ...certificateModule };

const isAppInitialized = getApps().length > 0;
const app: App = isAppInitialized
  ? getApp()
  : initializeApp({
      credential: cert(certificate as ServiceAccount),
    });
const auth: Auth = getAuth(app);

export { auth };

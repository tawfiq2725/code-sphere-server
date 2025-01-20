import admin from "firebase-admin";
import serviceAccount from "./codesphere-aeece-firebase-adminsdk-fbsvc-162262a234.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export { admin };

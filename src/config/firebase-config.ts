import Firebase from 'firebase-admin';
import serviceAccount from './ServiceAccount.json';

export const initializeFirebase = async () => {
  Firebase.initializeApp({
    credential: Firebase.credential.cert(
      serviceAccount as Firebase.ServiceAccount,
    ),
  });
};

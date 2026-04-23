import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC_co_a7y2VASNjgByrqGN-KaNI9d2g0Ns',
  authDomain: 'ddogam-test.firebaseapp.com',
  projectId: 'ddogam-test',
  storageBucket: 'ddogam-test.firebasestorage.app',
  messagingSenderId: '145542590136',
  appId: '1:145542590136:web:f356f28eb3f21d3220ce4d',
  measurementId: 'G-M5VS4GQ0T3',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

/**
 * SSR/미지원 브라우저에서 analytics 초기화 오류가 나지 않도록 보호합니다.
 */
export const initializeFirebaseAnalytics = async () => {
  if (typeof window === 'undefined') return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getAnalytics(firebaseApp);
};

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseStorage, getFirestoreDb } from '@/lib/firebase';
import { FileAttachment } from '@/lib/types/portal';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase services
const storage = getFirebaseStorage();
const db = getFirestoreDb();

const FILES_COLLECTION = 'portal_files';

// ============================================
// UPLOAD
// ============================================

export async function uploadFile(
  orgId: string,
  userId: string,
  userName: string,
  file: File,
  options?: {
    requestId?: string;
    commentId?: string;
  }
): Promise<FileAttachment> {
  // Generate unique filename
  const fileId = uuidv4();
  const extension = file.name.split('.').pop() || '';
  const storagePath = `portal/${orgId}/${fileId}.${extension}`;

  // Upload to Storage
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  // Save metadata to Firestore
  const fileData = {
    orgId,
    requestId: options?.requestId || null,
    commentId: options?.commentId || null,
    name: fileId,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url,
    storagePath,
    uploadedBy: userId,
    uploadedByName: userName,
    uploadedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, FILES_COLLECTION), fileData);

  return {
    id: docRef.id,
    ...fileData,
    uploadedAt: Timestamp.now(),
  } as FileAttachment;
}

export async function uploadMultipleFiles(
  orgId: string,
  userId: string,
  userName: string,
  files: File[],
  options?: {
    requestId?: string;
    commentId?: string;
  }
): Promise<FileAttachment[]> {
  const results = await Promise.all(
    files.map((file) => uploadFile(orgId, userId, userName, file, options))
  );
  return results;
}

// ============================================
// READ
// ============================================

export async function getFilesByOrg(orgId: string): Promise<FileAttachment[]> {
  const q = query(
    collection(db, FILES_COLLECTION),
    where('orgId', '==', orgId),
    orderBy('uploadedAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FileAttachment[];
}

export async function getFilesByRequest(requestId: string): Promise<FileAttachment[]> {
  const q = query(
    collection(db, FILES_COLLECTION),
    where('requestId', '==', requestId),
    orderBy('uploadedAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FileAttachment[];
}

// ============================================
// DELETE
// ============================================

export async function deleteFile(fileId: string, storagePath: string): Promise<void> {
  // Delete from Storage
  const storageRef = ref(storage, storagePath);
  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file from storage:', error);
  }

  // Delete from Firestore
  const docRef = doc(db, FILES_COLLECTION, fileId);
  await deleteDoc(docRef);
}

// ============================================
// HELPERS
// ============================================

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Music';
  if (mimeType.includes('pdf')) return 'FileText';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'Table';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'FileText';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'Archive';
  return 'File';
}

const DB_NAME = "medreminder-photos";
const STORE   = "photos";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE);
    req.onsuccess  = e => resolve(e.target.result);
    req.onerror    = e => reject(e.target.error);
  });
}

export async function getPhoto(medId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).get(medId);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror   = () => reject(req.error);
  });
}

export async function setPhoto(medId, dataUrl) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readwrite").objectStore(STORE).put(dataUrl, medId);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

export async function deletePhoto(medId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readwrite").objectStore(STORE).delete(medId);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

// Returns { medId: dataUrl, ... } — used for full backup export
export async function getAllPhotos() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const result = {};
    const req = db.transaction(STORE, "readonly").objectStore(STORE).openCursor();
    req.onsuccess = e => {
      const cursor = e.target.result;
      if (cursor) { result[cursor.key] = cursor.value; cursor.continue(); }
      else resolve(result);
    };
    req.onerror = () => reject(req.error);
  });
}

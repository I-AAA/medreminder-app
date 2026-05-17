import { useState, useEffect } from "react";
import { getPhoto } from "../photoStore";

export function usePhoto(medId, hasPhoto) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!hasPhoto || !medId) { setSrc(null); return; }
    let cancelled = false;
    getPhoto(medId).then(data => { if (!cancelled) setSrc(data); });
    return () => { cancelled = true; };
  }, [medId, hasPhoto]);
  return src;
}

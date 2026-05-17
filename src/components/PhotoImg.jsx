import { usePhoto } from "../hooks/usePhoto";

export function PhotoImg({ medId, hasPhoto, size, borderRadius, style = {} }) {
  const src = usePhoto(medId, hasPhoto);
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      style={{ width: size, height: size, objectFit: "cover", borderRadius, ...style }}
    />
  );
}

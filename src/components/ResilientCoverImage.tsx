import { useCallback, useEffect, useMemo, useState } from "react";
import { searchWikimediaImage } from "@/lib/wikimedia-image";

type ResilientCoverImageProps = {
  sources: string[];
  searchQuery: string;
  alt?: string;
  className?: string;
  objectPosition?: string;
};

export default function ResilientCoverImage({
  sources,
  searchQuery,
  alt = "",
  className = "absolute inset-0 h-full w-full object-cover",
  objectPosition = "50% 45%",
}: ResilientCoverImageProps) {
  const initial = useMemo(
    () => [...new Set(sources.filter(Boolean))],
    [sources],
  );
  const [urls, setUrls] = useState(initial);
  const [index, setIndex] = useState(0);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setUrls(initial);
    setIndex(0);
    setSearching(false);
  }, [initial]);

  const current = urls[index];

  const advance = useCallback(async () => {
    if (index + 1 < urls.length) {
      setIndex((i) => i + 1);
      return;
    }
    if (searching || !searchQuery.trim()) return;
    setSearching(true);
    const found = await searchWikimediaImage(searchQuery);
    setSearching(false);
    if (found && !urls.includes(found)) {
      setUrls((prev) => {
        const next = [...prev, found];
        setIndex(prev.length);
        return next;
      });
    }
  }, [index, urls, searchQuery, searching]);

  if (!current) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-orange-900/40 to-amber-800/30`}
        aria-hidden
      />
    );
  }

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      className={className}
      style={{ objectPosition }}
      onError={() => void advance()}
    />
  );
}

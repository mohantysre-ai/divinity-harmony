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
  const sourceKey = sources.filter(Boolean).join("\n");
  const initial = useMemo(
    () => [...new Set(sourceKey ? sourceKey.split("\n") : [])],
    [sourceKey],
  );
  const [urls, setUrls] = useState(initial);
  const [index, setIndex] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setUrls(initial);
    setIndex(0);
    setSearching(false);
    setSearched(false);
  }, [initial]);

  const current = urls[index];

  const advance = useCallback(async () => {
    if (index + 1 < urls.length) {
      setIndex((i) => i + 1);
      return;
    }
    if (searching || searched || !searchQuery.trim()) return;
    setSearching(true);
    setSearched(true);
    const found = await searchWikimediaImage(searchQuery);
    setSearching(false);
    if (found && !urls.includes(found)) {
      setUrls((prev) => {
        const next = [...prev, found];
        setIndex(prev.length);
        return next;
      });
    }
  }, [index, urls, searchQuery, searching, searched]);

  useEffect(() => {
    if (!current && !searched) void advance();
  }, [advance, current, searched]);

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

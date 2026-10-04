"use client";

import React, { useEffect, useState } from "react";

export function adminPreviewUrl(
  src: string | undefined,
  width?: 128 | 256 | 640
) {
  if (
    !src ||
    !width ||
    !/^\/(?:images|uploads|api\/images)\//.test(src) ||
    /\.(svg|gif)(?:[?#]|$)/i.test(src)
  )
    return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

// Show the saved URL itself. A missing file must not masquerade as a different product.
export function AdminImage({
  src,
  alt = "",
  onError,
  title,
  previewWidth,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  previewWidth?: 128 | 256 | 640;
}) {
  const [failed, setFailed] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);
  useEffect(() => {
    setFailed(false);
    setUseOriginal(false);
  }, [src]);
  const preview = adminPreviewUrl(src, previewWidth);
  return (
    <img
      {...props}
      src={useOriginal ? src : preview}
      alt={failed ? `Không tải được ảnh: ${alt}` : alt}
      loading={props.loading || "lazy"}
      decoding="async"
      title={failed ? `Không tải được ảnh từ ${src}` : title}
      onError={(event) => {
        if (!useOriginal && preview !== src) {
          setUseOriginal(true);
          return;
        }
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}

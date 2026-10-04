"use client";

import React, { useEffect, useState } from "react";

// Show the saved URL itself. A missing file must not masquerade as a different product.
export function AdminImage({ src, alt = "", onError, title, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <img {...props} src={src} alt={failed ? `Không tải được ảnh: ${alt}` : alt}
    loading={props.loading || "lazy"} decoding="async"
    title={failed ? `Không tải được ảnh từ ${src}` : title}
    onError={event => { setFailed(true); onError?.(event); }} />;
}

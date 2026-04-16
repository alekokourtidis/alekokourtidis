"use client";

export default function ToolFrame({ src, title }) {
  return (
    <iframe
      src={src}
      title={title}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        zIndex: 9999,
      }}
      allow="clipboard-read; clipboard-write"
    />
  );
}

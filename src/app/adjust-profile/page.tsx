"use client";
import { useState } from "react";
import Image from "next/image";

export default function AdjustProfile() {
  const [scale, setScale] = useState(125);
  const [x, setX] = useState(-5);
  const [y, setY] = useState(0);

  const cssValue = `scale-[${scale}%] translate-x-[${x}%] translate-y-[${y}%]`;
  const styleTransform = `scale(${scale / 100}) translateX(${x}%) translateY(${y}%)`;

  return (
    <div style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Adjust Profile Picture
      </h1>

      {/* Preview */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid #e5e0db",
          margin: "0 auto 2rem",
        }}
      >
        <Image
          src="/images/profile-circular.png"
          alt="Profile"
          width={400}
          height={400}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: styleTransform,
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          Zoom: {scale}%
          <input
            type="range"
            min={100}
            max={200}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>
        <label>
          Left/Right: {x}%
          <input
            type="range"
            min={-30}
            max={30}
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>
        <label>
          Up/Down: {y}%
          <input
            type="range"
            min={-30}
            max={30}
            value={y}
            onChange={(e) => setY(Number(e.target.value))}
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>
      </div>

      {/* Output */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f5f0eb",
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: "0.875rem",
          wordBreak: "break-all",
        }}
      >
        <strong>Your values:</strong>
        <br />
        scale: {scale}% | x: {x}% | y: {y}%
      </div>
    </div>
  );
}

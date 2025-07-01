import React from "react";

interface SimpleCardProps {
  title: string;
  text: React.ReactNode;
}

export default function SimpleCard({ title, text }: SimpleCardProps) {
  return (
    <div
      style={{
        background: "#FCFCF8",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        marginBottom: "24px",
        border: "1px solid #F3F3ED",
        textAlign: "left",
      }}
    >
      <h2
        style={{
          color: "#4C0000",
          fontWeight: 600, // SemiBold
          fontSize: "24px",
          fontFamily: "Inter, sans-serif",
          marginBottom: "12px",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          color: "#5A5A5A",
          fontWeight: 400, // Regular
          fontSize: "15px",
          fontFamily: "Inter, sans-serif",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {text}
      </div>
    </div>
  );
}

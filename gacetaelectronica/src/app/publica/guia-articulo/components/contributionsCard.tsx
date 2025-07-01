import React from "react";

const contributionTypes = [
  {
    title: "Artículos científicos",
    description: "Investigaciones originales o revisiones breves",
  },
  {
    title: "Artículos científicos",
    description: "Investigaciones originales o revisiones breves",
  },
  {
    title: "Artículos científicos",
    description: "Investigaciones originales o revisiones breves",
  },
  {
    title: "Artículos científicos",
    description: "Investigaciones originales o revisiones breves",
  },
  {
    title: "Artículos científicos",
    description: "Investigaciones originales o revisiones breves",
  },
  {
    title: "Artículos científicos",
    description: "Investigaciones originales o revisiones breves",
  },
];

export default function ContributionsCard() {
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
          fontWeight: 600,
          fontSize: "24px",
          fontFamily: "Inter, sans-serif",
          marginBottom: "8px",
        }}
      >
        Tipos de contribuciones aceptadas
      </h2>
      <p
        style={{
          color: "#5A5A5A",
          fontSize: "15px",
          fontFamily: "Inter, sans-serif",
          marginBottom: "24px",
        }}
      >
        La gaceta acepta los siguientes géneros:
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {contributionTypes.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #F3F3ED",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <h3
              style={{
                color: "#4C0000",
                fontWeight: 600,
                fontSize: "16px",
                margin: "0 0 4px 0",
              }}
            >
              {item.title}
            </h3>
            <p style={{ color: "#5A5A5A", fontSize: "14px", margin: 0 }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
      <p
        style={{
          color: "#5A5A5A",
          fontSize: "15px",
          fontFamily: "Inter, sans-serif",
          margin: 0,
        }}
      >
        Otros formatos creativos: Ensayos literarios, fotoreportajes, etc.
      </p>
    </div>
  );
}

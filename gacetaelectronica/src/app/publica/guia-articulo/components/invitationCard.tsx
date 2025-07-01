import React from "react";

export default function InvitationCard() {
  return (
    <div
      style={{
        background: "#EFF6FF", // Color de fondo azulado
        borderRadius: "12px",
        padding: "32px 24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        marginBottom: "24px",
        border: "1px solid #E0E8F2", // Borde a juego con el fondo
        textAlign: "center",
      }}
    >
      <h2
        style={{
          color: "#4C0000",
          fontWeight: 700, // Bold
          fontSize: "24px",
          fontFamily: "Inter, sans-serif",
          marginBottom: "16px",
        }}
      >
        ¡Invitamos a toda la comunidad universitaria a participar!
      </h2>
      <p
        style={{
          color: "#5A5A5A",
          fontSize: "16px",
          fontFamily: "Inter, sans-serif",
          margin: "0 0 24px 0",
        }}
      >
        Comparte tus ideas, investigaciones y creaciones con nosotros
      </p>
      <p
        style={{
          color: "#5A5A5A",
          fontSize: "16px",
          fontFamily: "Inter, sans-serif",
          margin: "0 0 8px 0",
        }}
      >
        Para dudas específicas, contactar a:
      </p>
      <p
        style={{
          color: "#4C0000",
          fontWeight: 600, // SemiBold
          fontSize: "16px",
          fontFamily: "Inter, sans-serif",
          margin: "0 0 4px 0",
        }}
      >
        Job Díaz Hernández
      </p>
      <p
        style={{
          color: "#5A5A5A",
          fontSize: "16px",
          fontFamily: "Inter, sans-serif",
          margin: 0,
        }}
      >
        investigacion@upqroo.edu.mx
      </p>
    </div>
  );
}

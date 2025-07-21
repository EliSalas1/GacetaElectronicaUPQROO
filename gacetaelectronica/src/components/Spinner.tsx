import React from "react";

export const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "text-blue-500",
}) => {
  const px = `${size}px`;

  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
      style={{
        width: px,
        height: px,
        borderRightColor: "transparent",
        borderBottomColor: "transparent",
      }}
    />
  );
};

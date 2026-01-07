// src/components/RoleOption.tsx
import React from "react";

type RoleOptionProps = {
  children: React.ReactNode;
  onClick: () => void;
};

export function RoleOption({ children, onClick }: RoleOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full text-left px-3 py-2 text-white
        hover:bg-purple-600 bg-[#33334d]
        transition font-medium border-b border-gray-700
        last:border-b-0
      "
    >
      {children}
    </button>
  );
}

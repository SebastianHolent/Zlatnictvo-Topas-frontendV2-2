"use client";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoriteHook";

export default function FavoriteButton({ productId, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleClick = (e) => {
    e.preventDefault();
    toggleFavorite(productId);
  };

  return (
    <button onClick={handleClick} className={className}>
      <Heart
        className={`w-6 h-6 transition-colors duration-200 ${
          isFavorite(productId)
            ? "fill-[#7C2529] text-[#7C2529]"
            : "text-black"
        }`}
      />
    </button>
  );
}

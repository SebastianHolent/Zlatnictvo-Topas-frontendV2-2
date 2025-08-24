"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FavoriteButton from "@/components/favoriteheart";

export default function ProductGallery({ product }) {
  const [index, setIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});

  function paginateLeft() {
    setIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  }

  function paginateRight() {
    setIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  }

  function handleMouseMove(e) {
    if (window.innerWidth < 1024) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)", // same zoom factor you had
    });
  }

  function handleMouseLeave() {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  }

  return (
    <div className="w-full lg:max-w-xl flex flex-col gap-4">
      {/* Main Image with Zoom */}
      <div
        className="relative overflow-hidden rounded flex justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={product.images[index].url}
          alt={product.title}
          width={500}
          height={500}
          className="rounded aspect-square object-cover lg:w-full transition-transform duration-300"
          style={zoomStyle}
          priority
        />
        <FavoriteButton
          productId={product.id}
          className="absolute top-2 right-2"
        />
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center items-center gap-2">
        <ArrowLeft onClick={paginateLeft} className="cursor-pointer" />
        {product.images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-blue-600" : "bg-gray-400"
            }`}
          />
        ))}
        <ArrowRight onClick={paginateRight} className="cursor-pointer" />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto max-w-full">
        {product.images.map((img, i) => (
          <Image
            key={i}
            src={img.url}
            alt={`${product.title} ${i + 1}`}
            className="w-20 h-20 object-cover cursor-pointer rounded"
            onClick={() => setIndex(i)}
            width={80}
            height={80}
            priority
          />
        ))}
      </div>
    </div>
  );
}

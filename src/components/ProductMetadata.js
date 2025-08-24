"use client";

import { Info } from "lucide-react";
import { useState } from "react";

export default function ProductMetadata({ product }) {
  if (!product.metadata) {
    return <p>Vlastnosti produktu neboli nájdené</p>;
  }

  const entries = Object.entries(product.metadata || {});
  const middleIndex = Math.ceil(entries.length / 2);
  const shouldSplit = middleIndex >= 4;
  const [showInfo, setShowInfo] = useState(false);

  const renderColumn = (items) => (
    <div className="flex flex-col gap-2 w-full">
      {items.map(([key, value]) => (
        <div
          key={key}
          className="flex justify-between border-b pb-1 text-sm items-center"
        >
          <span className="font-bold">{key}</span>
          <span className="flex items-center gap-1">
            {value}
            {key === "Rýdzosť zlata" && (
              <span className="relative group font-bold">
                <button
                  type="button"
                  onClick={() => setShowInfo((prev) => !prev)}
                  className="cursor-pointer"
                >
                  <Info className="size-5" />
                </button>

                <span
                  className={`
                    absolute 
                    right-0 top-full mt-2
                    2xl:left-full 2xl:top-1/2 2xl:-translate-y-1/2 2xl:ml-2 2xl:mt-0
                    w-max max-w-[150px] rounded-lg bg-gray-800 px-2 py-3 text-xs text-white
                    transition-opacity duration-200
                    pointer-events-none
                    group-hover:opacity-100 group-hover:pointer-events-auto   /* desktop hover */
                    ${showInfo ? "opacity-100 pointer-events-auto" : "opacity-0"}
                  `}
                >
                  Rýdzosť zlata je {value}{" "}
                  ({Math.round((parseFloat(value) / 1000) * 24)} karátov)
                </span>
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );

  if (shouldSplit) {
    const firstColumn = entries.slice(0, middleIndex);
    const secondColumn = entries.slice(middleIndex);
    return (
      <div className="flex flex-col gap-2 md:flex-row md:gap-6">
        {renderColumn(firstColumn)}
        {renderColumn(secondColumn)}
      </div>
    );
  }

  return renderColumn(entries);
}

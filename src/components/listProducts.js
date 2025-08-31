"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FavoriteButton from "@/components/favoriteheart";

export default function ListProducts({ products, category }) {
  const pathname = usePathname();
  const isEshopIndex = pathname === "/e-shop";

  return (
    <div className="w-screen flex items-center justify-center flex-col my-10">
      {isEshopIndex ? (
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center m-6">
          Kolekcia Zlatníctva Topas
        </h1>
      ) : (
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center m-6">
          {category.name}
        </h1>
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-10">
          Žiadne produkty na sklade
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 justify-items-center max-w-3/4 w-full">
          {products.map((p) => {
            const variant = p.variants?.[0];

            return (
              <Link
                href={`/e-shop/produkty/${p.handle}`}
                key={p.id}
                className="relative border border-transparent hover:scale-103 transition-all duration-300"
              >
                <div className="flex flex-col p-4 cursor-pointer max-w-sm">
                  <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                    {p.thumbnail ? (
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>Nepodarilo sa načítať</span>
                    )}

                    {/* Favorite Button */}
                    <FavoriteButton
                      productId={p.id}
                      className="absolute top-2 right-2"
                    />
                  </div>

                  <p className="text-lg mt-4">{p.title}</p>
                  <strong className="mt-1">
                    {variant?.calculated_price?.calculated_amount?.toFixed(2)} €
                  </strong>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

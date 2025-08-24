import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import FavoriteButton from "@/components/favoriteheart";
import Link from "next/link";

export default function RecentlyViewed({ product }) {
  const [recentItems, setRecentItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [startIndex, setStart] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6); // default desktop

  // Update items per page based on screen size
  useEffect(() => {
    function updateItemsPerPage() {
      if (window.innerWidth < 640) {
        setItemsPerPage(2); // mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3); // tablet
      } else if (window.innerWidth < 1440) {
        setItemsPerPage(4); // tablet
      } else {
        setItemsPerPage(6); // desktop
      }
    }
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Load and store updated product list in localStorage
  useEffect(() => {
    if (!product?.id) return;

    const visited = JSON.parse(localStorage.getItem("lastVisited") || "[]");
    const filtered = visited.filter((p) => p.id !== product.id);

    filtered.unshift({
      id: product.id,
      handle: product.handle,
      title: product.title,
      image: product.images[0]?.url || "",
      price: product.variants[0].calculated_price?.calculated_amount,
    });

    localStorage.setItem("lastVisited", JSON.stringify(filtered));
    setAllItems(filtered);
    setStart(0); // reset to first page when new product viewed
  }, [product]);

  // Slice visible items whenever indexes or list changes
  useEffect(() => {
    if (allItems.length > 0) {
      setRecentItems(allItems.slice(startIndex, startIndex + itemsPerPage));
    }
  }, [allItems, startIndex, itemsPerPage]);

  if (!recentItems.length) return null;

  return (
    <div className="my-8 flex items-center flex-col justify-center px-4">
      <h2 className="text-lg font-semibold mb-4">Naposledy prezerané produkty</h2>
      <div className="flex flex-row items-center gap-5">
        <LucideArrowLeft
          className="cursor-pointer"
          onClick={() => {
            if (startIndex > 0) {
              setStart(startIndex - 1);
            }
          }}
        />
        <div className="flex gap-4 flex-shrink-0 overflow-hidden">
          {recentItems.map((item) => (
            <Link
              key={item.id}
              href={`/e-shop/produkty/${item.handle}`}
              className="block overflow-hidden"
            >
            <div className="relative">
                <FavoriteButton
                    productId={item.id}
                    className="absolute top-2 right-2"
                />
                <img
                src={item.image}
                alt={item.title}
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-md"
                />
            </div>
              <div className="p-2">
                <h3 className="text-sm font-medium truncate">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.price.toFixed(2)}€</p>
              </div>
            </Link>
          ))}
        </div>
        <LucideArrowRight
          className="cursor-pointer"
          onClick={() => {
            if (startIndex + itemsPerPage < allItems.length) {
              setStart(startIndex + 1);
            }
          }}
        />
      </div>
    </div>
  );
}

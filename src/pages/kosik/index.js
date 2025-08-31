import { useEffect, useState } from "react";
import { sdk } from "@/lib/sdk";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CheckoutTracker from "@/components/checkoutTracker";

export default function Main() {
  const { cart, setCart } = useCart(); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cartId = typeof window !== "undefined" && localStorage.getItem("cart_id");
    if (!cartId) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const { cart } = await sdk.store.cart.retrieve(cartId);
        setCart({
          ...cart,
          items: [...cart.items].sort((a, b) => a.id.localeCompare(b.id)),
        });
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [setCart]);

  const removeItem = async (itemId) => {
    const cartId = typeof window !== "undefined" && localStorage.getItem("cart_id");
    if (!cartId) return;

    try {
      await sdk.store.cart.deleteLineItem(cartId, itemId);
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cartId);
      setCart({
        ...updatedCart,
        items: [...updatedCart.items].sort((a, b) => a.id.localeCompare(b.id)),
      });
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Načítavam košík...</p>;

  return (
    <div className="p-8 bg-white text-black min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Nákupný košík</h1>
      <CheckoutTracker/>
      {cart.items.length === 0 || !cart ? (
        <div className="flex flex-col items-center">
          <p className="text-center text-gray-600">Košík je prázdny.</p>
          <Link href="/e-shop">
            <button className="mt-4 px-6 py-3 bg-black text-white hover:bg-white hover:text-black transition rounded-xl font-medium border cursor-pointer">
              Pokračovať v nákupoch
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-6 border-b pb-6 items-center">
              <Link href={`/e-shop/produkty/${item.product_handle}`}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="size-28 aspect-square object-cover rounded-xl"
                />
              </Link>
              <div className="flex justify-between w-full flex-row">
                <div>
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.variant_title}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Cena: {(item.unit_price).toFixed(2)} €
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <TrashIcon
                    className="cursor-pointer text-red-500"
                    onClick={() => removeItem(item.id)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="text-right pt-6">
            <p className="text-lg font-semibold text-gray-800">
              Cena bez DPH: {(cart.original_item_subtotal).toFixed(2)} €
            </p>
            <p className="text-xl font-semibold">
              Celková cena: {(cart.total).toFixed(2)} €
            </p>
            <Link href="/kontaktne-udaje">
              <button className="mt-4 px-6 py-3 bg-black text-white hover:bg-white hover:text-black transition rounded-xl font-medium border cursor-pointer">
                Pokračovať v objednávke
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

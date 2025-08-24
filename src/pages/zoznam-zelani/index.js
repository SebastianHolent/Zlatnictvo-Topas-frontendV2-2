"use client";

import { useState, useEffect } from "react";
import { sdk } from "@/lib/sdk";
import { useCart } from "@/context/CartContext";

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, refreshCart } = useCart();

  const [openMenuFor, setOpenMenuFor] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

        if (!favorites.length) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const fetched = await Promise.all(
          favorites.map(async (id) => {
            try {
              const { product } = await sdk.store.product.retrieve(id, {
                fields: `*variants.calculated_price,+variants.inventory_quantity,*categories,*options`,
              });
              return product;
            } catch (err) {
              console.error("Error fetching product", id, err.message);
              return null;
            }
          })
        );

        setProducts(fetched.filter(Boolean));
      } catch (err) {
        console.error("Error reading favorites:", err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  useEffect(() => {
    if (!products.length) return;

    const newQuantities = {};
    products.forEach((product) => {
      const variant = getCorrectVariant(product);
      if (!variant) return;

      const stock = variant.inventory_quantity || 0;
      const inCartQty =
        cart?.items?.find((item) => item.variant_id === variant.id)?.quantity ||
        0;
      const effectiveAvailableQty = Math.max(stock - inCartQty, 0);

      newQuantities[product.id] =
        effectiveAvailableQty > 0 ? Math.min(1, effectiveAvailableQty) : 0;
    });

    setQuantities(newQuantities);
  }, [products, cart]);

  const removeFromWishlist = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem(
      "favorites",
      JSON.stringify(updated.map((p) => p.id))
    );
  };

  function isRetiazka(product) {
    return product.categories.some((c) => c.name === "Retiazky na krk");
  }

  function getCorrectVariant(product) {
    if (isRetiazka(product)) {
      const selectedOptionId = localStorage.getItem(
        `necklace-option-id--${product.handle}`
      );
      if (selectedOptionId) {
        return product.variants.find((v) =>
          v.options.some((opt) => opt.id === selectedOptionId)
        );
      }
      return null;
    }
    return product.variants[0];
  }

  async function ensureCartId() {
    let cartId = localStorage.getItem("cart_id");
    if (!cartId) {
      const { cart } = await sdk.store.cart.create();
      cartId = cart.id;
      localStorage.setItem("cart_id", cartId);
      document.cookie = `cart_id=${cartId}; path=/; max-age=31536000; samesite=lax`;
    }
    return cartId;
  }

  async function handleAddToCart(product) {
    try {
      const cartId = await ensureCartId();
      const variant = getCorrectVariant(product);
      if (!variant) {
        console.error("No valid variant found for product");
        return;
      }

      const qty = quantities[product.id] || 1;
      if (qty <= 0) return;

      await sdk.store.cart.createLineItem(cartId, {
        variant_id: variant.id,
        quantity: qty,
      });

      await refreshCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  function sortLengths(product) {
    const length = [];
    if (!product?.options) return length;
    for (const option of product.options) {
      for (const value of option.values) {
        length.push({
          option_value: value.value,
          option_id: value.id,
        });
      }
    }
    length.sort((a, b) => Number(a.option_value) - Number(b.option_value));
    return length;
  }

  if (loading) {
    return (
      <div className="mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Zoznam želaní</h1>
        <p>Načítavam produkty...</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Zoznam želaní</h1>
        <p>Váš zoznam želaní je prázdny.</p>
      </div>
    );
  }

  return (
    <>
    <h1 className="text-3xl font-bold p-8">Zoznam želaní</h1>
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-4">
        {products.map((product) => {
          const variant = getCorrectVariant(product);
          const price = variant?.calculated_price?.calculated_amount || 0;
          const stock = variant?.inventory_quantity || 0;

          const inCartQty =
            cart?.items?.find((item) => item.variant_id === variant?.id)
              ?.quantity || 0;
          const effectiveAvailableQty = Math.max(stock - inCartQty, 0);

          const qty = quantities[product.id] || 0;

          const sortedLengths = sortLengths(product);

          return (
            <div
              key={product.id}
              className="p-15 md:p-4 flex flex-col md:flex-row gap-4 rounded-lg items-center justify-center text-center"
            >
              {product.thumbnail && (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-50 h-50 md:w-32 md:h-32 object-cover rounded-2xl"
                />
              )}
              <div className="flex-1 w-full">
                <p className="text-lg font-semibold">{product.title}</p>
                <p className="text-lg">{price.toFixed(2)} €</p>
                <p
                  className={`text-xs sm:text-sm ${
                    effectiveAvailableQty > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {effectiveAvailableQty > 0
                    ? `Dostupné: ${effectiveAvailableQty} ks (celkovo ${stock}, v košíku ${inCartQty})`
                    : "Tovar je vypredaný alebo už máte všetky dostupné kusy v košíku."}
                </p>
              </div>

              {isRetiazka(product) && (
                <div className="relative w-full md:w-auto">
                  <input
                    placeholder="--Vyberte si dĺžku--"
                    value={
                      localStorage.getItem(`necklace-length-${product.handle}`)
                        ? `${localStorage.getItem(
                            `necklace-length-${product.handle}`
                          )}cm`
                        : ""
                    }
                    readOnly
                    onClick={() =>
                      setOpenMenuFor((prev) =>
                        prev === product.id ? null : product.id
                      )
                    }
                    className="border border-gray-300 px-3 py-2 rounded cursor-pointer text-center w-full"
                  />
                  {openMenuFor === product.id && (
                    <div className="absolute left-0 right-0 mt-1 border border-gray-300 bg-white rounded shadow max-h-48 overflow-auto z-10">
                      {sortedLengths.map((length, idx) => (
                        <p
                          key={idx}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            localStorage.setItem(
                              `necklace-length-${product.handle}`,
                              length.option_value
                            );
                            localStorage.setItem(
                              `necklace-option-id--${product.handle}`,
                              length.option_id
                            );
                            setOpenMenuFor(null);
                          }}
                        >
                          {length.option_value}cm
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 items-stretch md:items-end w-full md:w-auto">
                {effectiveAvailableQty > 0 && (
                  <div className="flex items-center border rounded-lg justify-center md:justify-end">
                    <button
                      onClick={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [product.id]: Math.max(1, (prev[product.id] || 1) - 1),
                        }))
                      }
                      className="px-3 py-1 text-lg"
                    >
                      –
                    </button>
                    <span className="px-4">{qty}</span>
                    <button
                      onClick={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [product.id]: Math.min(
                            effectiveAvailableQty,
                            (prev[product.id] || 1) + 1
                          ),
                        }))
                      }
                      className="px-3 py-1 text-lg"
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={effectiveAvailableQty <= 0}
                  className={`px-4 py-2 rounded-lg font-medium w-full md:w-auto ${
                    effectiveAvailableQty > 0
                      ? "bg-black text-white hover:bg-white hover:text-black border cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Pridať do košíka
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="px-4 py-2 rounded-lg font-medium border hover:bg-gray-100 cursor-pointer w-full md:w-auto"
                >
                  Odstrániť
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}

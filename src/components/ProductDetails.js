"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/sdk";
import { useCart } from "@/context/CartContext";

export default function ProductDetails({ product, onAddToCart }) {
  const DPH = 1.23;
  const { cart, refreshCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  // ---- Length selection ----
  const [isLengthOpen, setLengthOpen] = useState(false);
  const savedValue =
    typeof window !== "undefined"
      ? localStorage.getItem(`necklace-length-${product.handle}`)
      : null;
  const [selectedLength, setSelectedLength] = useState(() => savedValue);

  function isRetiazka(product) {
    return product.categories.some((c) => c.name === "Retiazky na krk");
  }

  function sortLengths(product) {
    const lengths = [];
    for (const option of product.options) {
      for (const value of option.values) {
        const variant = product.variants.find((v) =>
          v.options.some((opt) => opt.value === value.value)
        );
        lengths.push({
          option_value: value.value,
          option_id: value.id,
          inventory_quantity: variant?.inventory_quantity ?? 0,
        });
      }
    }
    lengths.sort((a, b) => Number(a.option_value) - Number(b.option_value));
    return lengths;
  }
  const sortedLengths = isRetiazka(product) ? sortLengths(product) : [];

  function getCorrectVariant(product) {
    if (isRetiazka(product)) {
      return product.variants.find((v) =>
        v.options.some((opt) => opt.value === selectedLength)
      );
    }
    return product.variants[0];
  }

  const selectedVariant = getCorrectVariant(product);
  const availableQty = selectedVariant?.inventory_quantity ?? 0;

  // ✅ Check how many of this variant are already in the cart
  const inCartQty =
    cart?.items?.find((item) => item.variant_id === selectedVariant?.id)
      ?.quantity || 0;

  // ✅ True available stock = total stock - already in cart
  const effectiveAvailableQty = Math.max(availableQty - inCartQty, 0);

  // ✅ Auto-correct quantity if user has more than allowed
  useEffect(() => {
    if (quantity > effectiveAvailableQty) {
      setQuantity(effectiveAvailableQty > 0 ? effectiveAvailableQty : 1);
    }
  }, [effectiveAvailableQty]);

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

  async function handleAddToCart() {
    try {
      const cartId = await ensureCartId();
      await sdk.store.cart.createLineItem(cartId, {
        variant_id: selectedVariant.id,
        quantity,
      });

      await refreshCart();
      if (onAddToCart) onAddToCart();
    } catch (err) {
      console.error("Error adding to cart", err);
    }
  }

  return (
    <div className="w-full lg:max-w-md flex flex-col">
      <h1 className="text-3xl sm:text-4xl font-semibold">{product.title}</h1>
      <h3 className="mt-6 text-sm sm:text-base">{product.subtitle}</h3>

      {/* Price */}
      <div className="mt-6">
        <p className="text-xl sm:text-2xl font-medium">
          {(product.variants[0].calculated_price?.calculated_amount).toFixed(2)}€
        </p>
        <p className="text-md font-medium text-gray-500">
          Bez DPH:{" "}
          {(
            product.variants[0].calculated_price?.calculated_amount / DPH
          ).toFixed(2)}
          €
        </p>
      </div>

      {/* Quantity */}
      {effectiveAvailableQty > 0 ? (
        <div className="mt-6">
          <label className="font-medium block mb-1">Množstvo:</label>
          <input
            className="border border-gray-300 w-24 px-3 py-2 rounded"
            type="number"
            min="1"
            max={effectiveAvailableQty}
            step="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.min(
                  effectiveAvailableQty,
                  Math.max(1, Number(e.target.value))
                )
              )
            }
          />
          <p className="mt-1 text-sm text-gray-600">
            Dostupné: {effectiveAvailableQty} ks (celkovo {availableQty} ks,
            v košíku {inCartQty} ks)
          </p>
        </div>
      ) : (
          !(isRetiazka(product) && !selectedLength) && (
            <p className="mt-6 text-sm text-gray-600">
              Tovar je vypredaný.
            </p>
          )
      )}

      {/* Length dropdown (only for necklaces) */}
      {isRetiazka(product) && (
        <div className="mt-6">
          <label className="font-medium block mb-1">Dĺžka:</label>
          <div className="relative w-64">
            <input
              placeholder="--Vyberte si dĺžku--"
              value={selectedLength ? `${selectedLength}cm` : ""}
              className={`text-center border border-gray-300 py-2 cursor-pointer w-full ${
                selectedLength || savedValue !== "undefined"
                  ? "text-black"
                  : "text-gray-400"
              }`}
              onClick={() => setLengthOpen((prev) => !prev)}
              readOnly
            />

            {isLengthOpen && (
              <div className="absolute left-0 right-0 mt-1 border border-gray-300 bg-white rounded shadow max-h-48 overflow-auto z-10">
                {sortedLengths.map((length, idx) => (
                  <p
                    key={idx}
                    className={`px-3 py-2 cursor-pointer ${
                      length.inventory_quantity === 0
                        ? "text-gray-400 line-through cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      if (length.inventory_quantity === 0) return;
                      setSelectedLength(length.option_value);
                      setLengthOpen(false);
                      localStorage.setItem(
                        `necklace-length-${product.handle}`,
                        length.option_value
                      );
                      localStorage.setItem(
                        `necklace-option-id--${product.handle}`,
                        length.option_id
                      );
                      setQuantity(1);
                    }}
                  >
                    {length.option_value}cm ({length.inventory_quantity} ks)
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add to cart */}
      {effectiveAvailableQty > 0 ? (
        <button
          className="mt-6 bg-black text-white hover:bg-white hover:text-black border-2 transition-colors duration-300 px-4 py-3 w-full rounded cursor-pointer"
          onClick={handleAddToCart}
        >
          Pridať do košíka
        </button>
      ) : (
        <button
          className="mt-6 bg-gray-200 text-white border-2 transition-colors duration-300 px-4 py-3 w-full rounded cursor-not-allowed"
          disabled
        >
          Nedostupné
        </button>
      )}

    </div>
  );
}

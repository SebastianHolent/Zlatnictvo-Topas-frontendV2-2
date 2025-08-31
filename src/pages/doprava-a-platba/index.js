"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { sdk } from "@/lib/sdk";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutTracker from "@/components/checkoutTracker";

export default function DopravaPlatba() {
  const { cart, setCart } = useCart();
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setProvider] = useState("pp_system_default");

  const router = useRouter();

  // Fetch shipping options on load
  useEffect(() => {
    const id = localStorage.getItem("cart_id");
    if (id) {
      sdk.store.fulfillment.listCartOptions({ cart_id: id }).then(({ shipping_options }) => {
        setShippingOptions(shipping_options);
      });
    }
  }, []);

  // Preselect shipping option from localStorage
  useEffect(() => {
    const savedShipping = localStorage.getItem("selected_shipping_option");
    if (savedShipping) setSelectedShipping(savedShipping);
  }, []);

  // Save selected shipping to localStorage and update cart in Medusa
  useEffect(() => {
    if (!selectedShipping || !cart) return;

    localStorage.setItem("selected_shipping_option", selectedShipping);

    const currentShipping = cart.shipping_methods?.[0]?.shipping_option_id;
    if (currentShipping === selectedShipping) return;

    sdk.store.cart.addShippingMethod(cart.id, { option_id: selectedShipping })
      .then(({ cart: updatedCart }) => setCart(updatedCart))
      .catch(err => console.error("Error updating shipping method:", err));
  }, [selectedShipping, cart, setCart]);

  const isReady = !!selectedShipping;

  return (
    <>
      <CheckoutTracker />
      <div className="bg-white min-h-screen px-4 py-10 sm:px-6 lg:px-20">
        <div className="max-w-4xl mx-auto mt-12 space-y-12">

          {/* Shipping */}
          <div>
            <h1 className="text-2xl font-semibold mb-6 text-black">Doprava</h1>
            {shippingOptions.length === 0 ? (
              <p className="text-gray-500">Načítavam možnosti dopravy...</p>
            ) : (
              <div className="space-y-4">
                {shippingOptions.map(option => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                      selectedShipping === option.id ? "bg-gray-50" : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        name="shipping_option"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={() => setSelectedShipping(option.id)}
                        className="form-radio w-5 h-5"
                      />
                      <div>
                        <p className="font-medium text-black">{option.name}</p>
                        {option.data?.delivery_time && (
                          <p className="text-sm text-gray-500">{option.data.delivery_time}</p>
                        )}
                      </div>
                    </div>
                    <p className="font-medium text-black">
                      {option.amount === 0 ? "Zadarmo" : `+${option.amount.toFixed(2)} €`}
                    </p>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment */}
          <div>
            <h1 className="text-2xl font-semibold mb-6 text-black">Platba</h1>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer transition bg-gray-50">
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    name="payment"
                    value="pp_system_default"
                    checked
                    readOnly
                    className="form-radio w-5 h-5"
                  />
                  <p className="font-medium text-black">
                    Bankový prevod 
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Totals */}
          {cart && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
              <div className="flex justify-between text-black">
                <span>Medzisúčet (bez dopravy)</span>
                <span>{(cart.total - cart.shipping_total).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Doprava</span>
                <span>{cart.shipping_total === 0 ? "Zadarmo" : (cart.shipping_total).toFixed(2) + " €"}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg text-black">
                <span>Celkom na zaplatenie</span>
                <span>{cart.total.toFixed(2)} €</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="col-span-full mt-6 flex justify-between">
            <Link href="/kontaktne-udaje">
              <button
                type="button"
                className="px-6 py-3 underline underline-offset-3 cursor-pointer text-black font-medium"
              >
                Krok naspäť
              </button>
            </Link>

            <button
              disabled={!isReady || loading}
              className={`px-6 py-3 transition rounded-xl font-medium ${
                isReady && !loading
                  ? "bg-black text-white hover:text-black hover:bg-white border cursor-pointer"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => {
                setLoading(true);
                sdk.store.cart
                  .complete(cart.id)
                  .then((data) => {
                    if (data.type === "order" && data.order) {
                      const orderId = data.order.id;
                      localStorage.removeItem("cart_id");
                      router.push(`/dokoncenie-objednavky/${orderId}`);
                    } else {
                      console.error("Error completing cart:", data.error || data);
                    }
                  })
                  .finally(() => setLoading(false));
              }}
            >
              {loading ? "Načítavam..." : "Zaplatiť a dokončiť objednávku"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { sdk } from "@/lib/sdk";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutTracker from "@/components/checkoutTracker";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

const SLOVAKIA_PAYMENT_PROVIDERS = [
  { id: "pp_stripe_stripe", label: "Platba kartou online" },
  { id: "pp_system_default", label: "Platba na dobierku" },
];

export default function DopravaPlatba() {
  const { cart, setCart } = useCart();
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const [selectedProvider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const lastCartIdRef = useRef(null);
  const lastProviderRef = useRef(null);
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
    if (savedShipping) {
      setSelectedShipping(savedShipping);
    }
  }, []);

  // Save selected shipping to localStorage and update cart in Medusa
  useEffect(() => {
    if (!selectedShipping || !cart) return;

    localStorage.setItem("selected_shipping_option", selectedShipping);

    const currentShipping = cart.shipping_methods?.[0]?.shipping_option_id;
    if (currentShipping === selectedShipping) return;

    sdk.store.cart.addShippingMethod(cart.id, {
      option_id: selectedShipping,
    })
      .then(({ cart: updatedCart }) => {
        setCart(updatedCart);
      })
      .catch((err) => {
        console.error("Error updating shipping method:", err);
      });
  }, [selectedShipping, cart, setCart]);

  // Preselect provider if already chosen in cart
  useEffect(() => {
    if (!cart) return;
    const existingSession = cart.payment_collection?.payment_sessions?.[0];
    if (existingSession) {
      setProvider(existingSession.provider_id);
    }
  }, [cart]);

  // Whenever provider changes, update/initiate payment session
  useEffect(() => {
    const updatePaymentSession = async () => {
      if (!cart || !selectedProvider) return;

      if (
        lastCartIdRef.current === cart.id &&
        lastProviderRef.current === selectedProvider
      ) {
        return;
      }

      lastCartIdRef.current = cart.id;
      lastProviderRef.current = selectedProvider;

      setLoading(true);
      try {
        await sdk.store.payment.initiatePaymentSession(cart, {
          provider_id: selectedProvider,
        });

        const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id);
        setCart(updatedCart);

        if (selectedProvider === "pp_stripe_stripe") {
          const stripeSession =
            updatedCart.payment_collection?.payment_sessions?.find(
              (session) => session.provider_id === "pp_stripe_stripe"
            );
          if (stripeSession?.data?.client_secret) {
            setClientSecret(stripeSession.data.client_secret);
          }
        } else {
          setClientSecret(null);
        }
      } catch (err) {
        console.error("Error updating payment session:", err);
      } finally {
        setLoading(false);
      }
    };

    updatePaymentSession();
  }, [selectedProvider, cart, setCart]);

  const isReady =
    selectedShipping &&
    ((selectedProvider === "pp_system_default") ||
      (selectedProvider === "pp_stripe_stripe" && clientSecret));

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
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                      selectedShipping === option.id
                        ? "bg-gray-50"
                        : "border-gray-300"
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
                          <p className="text-sm text-gray-500">
                            {option.data.delivery_time}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-medium text-black">
                      {option.amount === 0 || option.id === "Na dobierku"
                        ? "Zadarmo"
                        : `+${option.amount.toFixed(2)} €`}
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
              {SLOVAKIA_PAYMENT_PROVIDERS.map((provider) => (
                <label
                  key={provider.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                    selectedProvider === provider.id
                      ? "bg-gray-50"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="radio"
                      name="payment"
                      value={provider.id}
                      checked={selectedProvider === provider.id}
                      onChange={() => setProvider(provider.id)}
                      disabled={loading}
                      className="form-radio w-5 h-5"
                    />
                    <p className="font-medium text-black">{provider.label}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Stripe Payment Form */}
          {clientSecret && selectedProvider === "pp_stripe_stripe" && (
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm />
              </Elements>
            </div>
          )}

          {/* Totals */}
          {cart && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
              <div className="flex justify-between text-black">
                <span>Medzisúčet (bez dopravy)</span>
                <span>{((cart.total) - (cart.shipping_total)).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Doprava</span>
                <span>
                  {cart.shipping_total === 0 || selectedShipping === "pp_system_default"
                    ? "Zadarmo"
                    : (cart.shipping_total).toFixed(2) + " €"}
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg text-black">
                <span>Celkom na zaplatenie</span>
                <span>{(cart.total).toFixed(2)} €</span>
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

            {selectedProvider === "pp_system_default" && (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dokoncenie-objednavky",
      },
      redirect: "if_required",
    });

    if (result.error) {
      setPaymentError(result.error.message);
      setIsProcessing(false);
      return;
    }

    try {
      const cartId = localStorage.getItem("cart_id");
      if (cartId) {
        const { type, order, error } = await sdk.store.cart.complete(cartId);
        if (type === "order" && order) {
          const orderId = order.id;
          localStorage.removeItem("cart_id");
          router.push(`/dokoncenie-objednavky/${orderId}`);
        } else {
          console.error("Error completing cart:", error);
        }
      }
    } catch (err) {
      console.error("Cart completion error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {paymentError && (
        <div className="text-red-500 text-sm mt-1">{paymentError}</div>
      )}
      <button
        disabled={!stripe || isProcessing}
        type="submit"
        className="px-6 py-3 bg-black text-white rounded-xl hover:text-black hover:bg-white border transition font-medium w-full cursor-pointer"
      >
        {isProcessing ? "Spracovávam..." : "Zaplatiť teraz"}
      </button>
    </form>
  );
}

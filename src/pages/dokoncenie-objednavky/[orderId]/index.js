"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/sdk";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function OrderConfirmation() {
  const params = useParams();
  const orderId = params?.orderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Payment Statuses (from Medusa documentation)
  const paymentStatusMap = {
    authorized: "Platba autorizovaná (Banka potvrdila platbu, ale peniaze ešte neboli strhnuté)",
    partially_authorized: "Čiastočne autorizovaná platba (Časť platby bola autorizovaná, napr. po úprave objednávky)",
    captured: "Platba prijatá (Peniaze boli úspešne strhnuté)",
    partially_captured: "Čiastočne prijatá platba (Časť platby bola strhnutá, napr. po úprave objednávky)",
    refunded: "Platba vrátená (Celá platba bola vrátená)",
    partially_refunded: "Čiastočne vrátená platba (Časť peňazí bola vrátená zákazníkovi)"
  };

  // Fulfillment Statuses (from Medusa documentation)
  const fulfillmentStatusMap = {
    not_fulfilled: "Ešte nespracované (Objednávka čaká na vybavenie)",
    partially_fulfilled: "Čiastočne vybavené (Časť objednávky bola vybavená)",
    fulfilled: "Vybavené (Objednávka bola vybavená)",
    partially_shipped: "Čiastočne odoslané (Časť objednávky bola odoslaná)",
    shipped: "Odoslané (Balík je na ceste)",
    partially_delivered: "Čiastočne doručené (Časť objednávky bola doručená alebo vyzdvihnutá)",
    delivered: "Doručené (Objednávka bola doručená alebo vyzdvihnutá)",
    partially_returned: "Čiastočne vrátené (Časť tovaru bola vrátená)",
    returned: "Vrátené (Tovar bol vrátený)",
    canceled: "Zrušené (Objednávka bola zrušená)"
  };

  useEffect(() => {
    if (!orderId) return;

    // Fetch order from Medusa
    sdk.store.order
      .retrieve(orderId)
      .then(({ order }) => {
        setOrder(order);
        setLoading(false);

        // Fetch payment method from custom API route
        fetch(`http://localhost:9000/store/orders/${orderId}/payment-method`)
          .then(res => res.json())
          .then(data => {
            const providerId =
              data?.data?.[0]?.payment_collections?.[0]?.payments?.[0]?.provider_id || null;
            const providerMap = {
              pp_system_default: "Platba na dobierku",
              pp_stripe_stripe: "Platba kartou online"
            };

            setPaymentMethod(providerMap[providerId] || "Neznáme");
          })
          .catch(err => console.error("Error fetching payment method:", err));
      })
      .catch(err => {
        console.error("Error fetching order:", err);
        setLoading(false);
      });
  }, [orderId]);
        
  const getDisplayedPaymentStatus = () => {
            // If method is COD (dobierka) or system_default, and not yet captured
            if (
              (paymentMethod === "Platba na dobierku" || paymentMethod === "pp_system_default") &&
              order.payment_status !== "Zachytená"
            ) {
              return "Nezaplatené";
            }

            // Otherwise fallback to mapped statuses
            return paymentStatusMap[order.payment_status] || order.payment_status;
          };

  if (loading || !orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Načítavam objednávku...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Objednávka sa nenašla.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Ďakujeme za Vašu objednávku!</h1>
      <p className="mb-2 text-lg">
        Číslo objednávky: <span className="font-semibold">{order.display_id}</span>
      </p>
      <p className="mb-6">
        Dátum objednávky:{" "}
        <span className="font-semibold">
          {new Date(order.created_at).toLocaleDateString("sk-SK", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </p>
        <button
          onClick={async () => {
            try {
              const res = await fetch(`http://localhost:9000/store/orders/${orderId}/invoices`);
              if (!res.ok) throw new Error("Nepodarilo sa stiahnuť faktúru");

              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `invoice-${order.id}.pdf`;
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              console.error("Chyba pri sťahovaní faktúry:", err);
              alert("Nepodarilo sa stiahnuť faktúru. Skúste znova.");
            }
          }}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black border transition mb-6 cursor-pointer"
        >
          Stiahnuť faktúru
        </button>

      {/* Order Items */}
      <div className="bg-gray-50 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Detaily objednávky</h2>
        {order.items.map(item => (
          <div
            key={item.id}
            className="flex justify-between py-2 border-b border-gray-200 last:border-0"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{item.title}</span>
                {item.variant?.title && <span className="text-gray-600 text-sm">{item.variant.title}</span>}
                {item.color && <span className="text-gray-600 text-sm">{item.color}</span>}
                <span className="font-medium text-gray-900 mt-1">
                  {item.quantity} × {item.unit_price.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-4 font-semibold">
          <span>Medzisúčet</span>
          <span>{order.subtotal.toFixed(2)} €</span>
        </div>

        {order.discount_total > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Zľava</span>
            <span>-{order.discount_total.toFixed(2)} €</span>
          </div>
        )}

        {order.tax_total > 0 && (
          <div className="flex justify-between">
            <span>DPH</span>
            <span>{order.tax_total.toFixed(2)} €</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Doprava</span>
          <span>{order.shipping_total === 0 ? "Zadarmo" : order.shipping_total.toFixed(2) + " €"}</span>
        </div>

        <hr className="my-2" />
        <div className="flex justify-between text-lg font-bold">
          <span>Celkom</span>
          <span>{order.total.toFixed(2)} €</span>
        </div>
      </div>

      {/* Payment Method & Status */}
      <div className="bg-gray-50 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Platba a stav</h2>
        <p>
          <span className="font-semibold">Platobná metóda:</span> {paymentMethod || "Neznáme"}
        </p>
        <p>
          <span className="font-semibold">Stav platby:</span> {getDisplayedPaymentStatus()}
        </p>
        <p>
          <span className="font-semibold">Stav objednávky:</span> {fulfillmentStatusMap[order.fulfillment_status] || order.fulfillment_status}
        </p>
      </div>

      {/* Shipping Address */}
      <div className="bg-gray-50 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Dodacia adresa</h2>
        <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
        <p>{order.shipping_address.address_1}</p>
        {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
        <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
        <p>{order.shipping_address.phone}</p>
        <p>{order.email}</p>
      </div>

      {/* Tracking */}
      {order.fulfillments?.length > 0 && order.fulfillments[0]?.tracking_links?.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-xl mb-6 border">
          <h2 className="text-xl font-semibold mb-4">Sledovanie zásielky</h2>
          {order.fulfillments[0].tracking_links.map((track, i) => (
            <p key={i}>
              <Link href={track.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {track.tracking_number}
              </Link>
            </p>
          ))}
        </div>
      )}

<div className="mt-8 text-center space-y-4">
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black border transition"
        >
          Späť na úvod
        </Link>
      </div>
    </div>
  );
}

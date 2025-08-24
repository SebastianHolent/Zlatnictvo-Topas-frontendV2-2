import { createContext, useContext, useState, useEffect } from "react";
import { sdk } from "@/lib/sdk";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const initCart = async () => {
      let cartId = localStorage.getItem("cart_id");

      if (cartId) {
        try {
          const { cart } = await sdk.store.cart.retrieve(cartId);
          setCart(cart);
          return;
        } catch (err) {
          console.error("Failed to retrieve cart, creating new one...", err);
          localStorage.removeItem("cart_id");
        }
      }

      try {
        const { cart: newCart } = await sdk.store.cart.create();
        localStorage.setItem("cart_id", newCart.id);
        setCart(newCart);
      } catch (err) {
        console.error("Failed to create cart:", err);
      }
    };

    initCart();
  }, []);

  const refreshCart = async () => {
    const cartId = localStorage.getItem("cart_id");
    if (!cartId) return;
    try {
      const { cart } = await sdk.store.cart.retrieve(cartId);
      setCart(cart);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
    }
  };


  return (
    <CartContext.Provider value={{ cart, setCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

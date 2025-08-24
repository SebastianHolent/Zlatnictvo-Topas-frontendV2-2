import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, ShoppingCartIcon, User } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleHamburger = () => setIsOpen((prev) => !prev);
  const { cart } = useCart();

  const quantity = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const total = cart?.total

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-100 w-full bg-white shadow-md transition-shadow text-black">
      <div className="flex items-center justify-between px-5 py-5 md:py-2">
        <div className="flex items-center space-x-2 z-51">
          <img
              src="/LOGO.webp"
              alt="Zlatníctvo Topas"
              className="[height:clamp(2.5rem,4vw+1rem,3.5rem)]"
            />
          <div className="font-bold uppercase [font-size:clamp(1rem,2vw+0.5rem,2rem)]">
            Zlatníctvo Topas
          </div>
        </div>

        {/* PC Menu */}
        <div className="hidden lg:flex justify-center items-center space-x-6">
          <Link href="/" className="hover:text-yellow-600 transition duration-300">Domov</Link>
          <Link href="/e-shop" className="hover:text-yellow-600 transition duration-300">E-shop</Link>
          <Link href="/kontakt" className="hover:text-yellow-600 transition duration-300">Kontakt</Link>
          <Link href="/na-mieru" className="hover:text-yellow-600 transition duration-300">Na Mieru</Link>
          <Link href="/zoznam-zelani"> <Heart className={`h-6 hover:scale-110 transition duration-300}`}/></Link>
          <div className="relative">
            <Link href="/kosik">
              <ShoppingCartIcon className={`h-6 hover:scale-110 transition duration-300}`}/>
            </Link>
            {quantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {quantity}
              </span>
            )}
          </div>
          <span>{cart?.total ? cart.total.toFixed(2) : "0.00"}€</span>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
        <div className="flex flex-row items-center space-x-2">
                    <Link href="/zoznam-zelani"> <Heart className={`size-6 hover:scale-110 transition duration-300}`}/></Link>    
            <Link href="/kosik" className="z-9999">
                    <div className="relative">
                      <ShoppingCartIcon className={`h-6 hover:scale-110 transition duration-300}`}/>
                      {quantity > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {quantity}
                        </span>
                      )}
                    </div>
            </Link>
            <span className="z-9999 hidden sm:block">{cart?.total ? cart.total.toFixed(2) : "0.00"}€</span>
            <button
              onClick={toggleHamburger}
              className="relative flex flex-col justify-between w-6 h-5 z-9999 focus:outline-none"
            >
              <span className={`h-1 bg-black rounded transition-transform duration-300 ${isOpen ? "transform rotate-45 translate-y-2" : ""}`} />
              <span className={`h-1 bg-black rounded transition duration-300 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-1 bg-black rounded transition-transform duration-300 ${isOpen ? "transform -rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>

          {isOpen && (
            <div className="fixed inset-0 flex flex-col items-center justify-center space-y-6 text-2xl bg-white z-50">
              <Link onClick={toggleHamburger} href="/" className="hover:text-yellow-600 transition duration-300">Domov</Link>
              <Link onClick={toggleHamburger} href="/e-shop" className="hover:text-yellow-600 transition duration-300">E-shop</Link>
              <Link onClick={toggleHamburger} href="/kontakt" className="hover:text-yellow-600 transition duration-300">Kontakt</Link>
              <Link onClick={toggleHamburger} href="/na-mieru" className="hover:text-yellow-600 transition duration-300">Na Mieru</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

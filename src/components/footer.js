import Link from "next/link";

export default function Footer() {
  return (
    <footer className="min-w-dvw bg-gray-200 text-black pt-10 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 text-center lg:text-left">
        <div className="flex justify-center lg:justify-start items-center">
          <img src="/LOGO.webp" className="size-32"/>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">
            <Link href="/kontakt" className="hover:text-yellow-600 transition duration-300">Kontakt</Link>
          </h3>
          <hr className="border-gray-400 w-1/2 mx-auto lg:mx-0 mb-2" />
          <p className="text-sm">jozefsucko@gmail.com</p>
          <p className="text-sm">+421 915 946 801</p>
          <p className="text-sm">+421 949 373 888</p>
          <p className="text-sm">Zlatníctvo Topas</p>
          <p className="text-sm">Námestie mieru 1, Prešov, 080 01</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Podmienky a ustanovenia</h3>
          <hr className="border-gray-400 w-1/2 mx-auto lg:mx-0 mb-2" />
          <ul className="space-y-2 text-sm">
            <li><Link href="/obchodne-podmienky" className="hover:text-yellow-600 transition duration-300">Obchodné podmienky</Link></li>
            <li><Link href="/ochrana-osobnych-udajov" className="hover:text-yellow-600 transition duration-300">Ochrana osobných údajov</Link></li>
            <li><Link href="/doprava-a-platba" className="hover:text-yellow-600 transition duration-300">Doprava a platba</Link></li>
            <li><Link href="/reklamacny-protokol" className="hover:text-yellow-600 transition duration-300">Reklamačný protokol</Link></li>
            <li><Link href="/odstupenie-od-zmluvy" className="hover:text-yellow-600 transition duration-300">Odstúpenie od zmluvy</Link></li>
          </ul>
        </div>

      </div>

      <div className="text-center text-xs mt-8 text-gray-600">
        © {new Date().getFullYear()} Zlatníctvo Topas.
      </div>
    </footer>
  );
}

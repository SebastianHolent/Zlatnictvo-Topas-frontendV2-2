import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import Link from "next/link";

export default function Main() {
    const mapURL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d654.3764057318766!2d21.239044828596565!3d49.00096489820203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473ef29df692336f%3A0xab6a6113c1a0c13!2sZlatn%C3%ADctvo%20Topas!5e0!3m2!1sen!2sus!4v1751794377893!5m2!1sen!2sus"

    const contactItems = [
    {
      icon: "https://img.icons8.com/ios/100/marker--v2.png",
      label: "Adresa",
      content: (
        <>
          <p className="font-semibold">Zlatníctvo Topas</p>
          <p>Námestie mieru 1, Prešov, 080 01</p>
        </>
      ),
    },
    {
      icon: "https://img.icons8.com/ios/100/clock--v2.png",
      label: "Otváracie hodiny",
      content: <p><span className="font-semibold">Po - Pi</span>: <br></br>9:00 - 17:00</p>,
    },
    {
      icon: "https://img.icons8.com/ios/100/phone--v2.png",
      label: "Telefón 1",
      content: <p className="font-semibold">+421 915 946 801</p>,
    },
    {
      icon: "https://img.icons8.com/ios/100/info--v4.png",
      label: "Telefón 2",
      content: <p className="font-semibold">+421 949 373 888</p>,
    },
    {
      icon: "https://img.icons8.com/ios/100/new-post--v2.png",
      label: "Email",
      content: <p className="font-semibold">jozefsucko@gmail.com</p>,
    },
    {
      icon: "https://img.icons8.com/ios/100/facebook--v2.png",
      label: "Facebook",
      content: (
        <>
          <Link 
            href="https://www.facebook.com/TopasPresov"
            className="underline font-semibold hover:text-yellow-700"
          >
            Facebook
          </Link>
          <p>Zlatníctvo Topas-Prešov</p>
        </>
      ),
    },
    {
      icon: "https://img.icons8.com/ios/100/instagram-new--v3.png",
      label: "Instagram",
      content: (
        <>
          <Link
            href="https://www.instagram.com/zlatnictvotopas/"
            className="underline font-semibold hover:text-yellow-700"
          >
            instagram
          </Link>
          <p>@zlatnictvotopas</p>
        </>
      ),
    },
  ];

    return (
        <main className="flex flex-col justify-center items-center gap-12 mb-25 text-gray-900">
          <div className="flex flex-col justify-center items-center gap-12">
            <div className="w-screen bg-gray-100 h-[20dvh] text-center text-4xl md:text-5xl flex justify-center items-center font-medium">
                <h1>Kontakt</h1>
            </div>
            <div className="text-center max-w-2xl font-medium text-xl lg:text-2xl">
                <p className="mb-2">Na prvom mieste je pre nás vždy <span className="text-yellow-700 font-semibold">Náš Klient - Vy.</span></p>
                <p>Neváhajte nás kontaktovať s akoukoľvek otázkou.</p>
            </div>
          </div>
            <div className="flex flex-col gap-8 lg:flex-row">
                <iframe className="w-[80dvw] h-[280px] lg:w-[500px] lg:h-auto"src={mapURL} allowFullScreen loading="lazy"></iframe>
                <div className="flex flex-col tracking-wider">
                {contactItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                    <img src={item.icon} alt={item.label} className="size-8 mt-1" />
                    <div className="text-base md:text-lg">{item.content}</div>
                    </div>
                ))}
                </div>
            </div>
        </main>
    )
}
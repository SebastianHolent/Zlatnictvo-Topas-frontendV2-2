import React from "react";

export default function Main() {
  const services = [
    {
      title: "Gravírovanie",
      subtitle: "JEMNÉ A PRECÍZNE",
      description:
        "Zvečnite mená svojich blízkych, vaše najkrajšie chvíle alebo momenty, na ktoré sa nezabúda.",
      icon: "gravirovanie.webp",
    },
    {
      title: "Ródiovanie",
      subtitle: "ODOLNOSŤ A LESK",
      description:
        "Tenká vrstva ušľachtilého ródia ochráni Vaše šperky pred zubom času a oživí ich vzhľad.",
      icon: "rodiovanie.webp",
    },
  ];

  return (
    <main className="flex flex-col items-center gap-12">

      <div className="w-full bg-gray-100 h-[20dvh] flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-medium">
        <h1>Naše Služby</h1>
      </div>

      <div className="text-center font-medium max-w-4xl px-4">
        <h2 className="text-xl sm:text-2xl">
          <span className="text-yellow-700 font-semibold">Výroba</span>, <span className="text-yellow-700 font-semibold">oprava</span> a <span className="text-yellow-700 font-semibold">predaj</span> šperkov a klenotov akýchkoľvek materiálov a najlepších kvalít, už v centre Prešova.
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-12 px-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <img
              src={service.icon}
              alt={service.title}
              className="w-full h-auto max-w-[500px] max-h-[300px] object-cover"
            />
            <h3 className="text-lg sm:text-xl font-bold mt-4">
              {service.title}
            </h3>
            <h4 className="text-base sm:text-lg text-yellow-700 font-medium mt-1">
              {service.subtitle}
            </h4>
            <p className="mt-4 text-gray-700 px-2">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 py-10 w-full flex flex-col items-center px-4">
        <div className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-8">
          <h1>Servis a úprava špecifických šperkov</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center max-w-6xl">
          <img
            src="servis-a-oprava.webp"
            className="w-full max-w-[450px] h-auto max-h-[300px] object-cover"
            alt="Servis a oprava"
          />
          <p className="text-gray-700 w-full md:w-1/3">
            Ako jedno z mála zlatníctiev ponúkame plný rozsah služieb pre šperky špecifických potrieb a kvalít, skracovanie, čistenie alebo oprava spínania nie je žiadnym problémom.
          </p>
        </div>
      </div>
    </main>
  );
}

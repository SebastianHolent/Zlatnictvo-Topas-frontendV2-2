'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const jewels = [
  { img: '/zlate-sperky (2).webp', alt: 'Zlaté šperky', title: 'Zlaté šperky', subtitle: 'ELEGANCIA A PRESTÍŽ', desc: 'Žlté, biele alebo červené, zlato nikdy nevyzeralo príťažlivejšie.' },
  { img: '/diamantove-klenoty (2).webp', alt: 'Diamantové klenoty', title: 'Diamantové klenoty', subtitle: 'KEĎ LESK KOVU NESTAČÍ', desc: 'Vyberané a opracované s presnosťou a citom, naša pýcha.' },
  { img: '/uvod obrucky.webp', alt: 'Svadobné obrúčky', title: 'Svadobné obrúčky', subtitle: 'INVESTÍCIA NA CELÝ ŽIVOT', desc: 'Vyslovte svoje sľuby a podeľte sa nielen o spoločné chvíle.' },
  { img: '/perlove-sperky (2).webp', alt: 'Perlové šperky', title: 'Perlové šperky', subtitle: 'OKÚZLITE NESTARNÚCOU KRÁSOU', desc: 'Dary z hlbín mora doplnené jemným dotykom lesku.' },
];

export default function JewelShowcase() {
  const [startIdx, setStartIdx] = useState(0);
  const [isCarousel, setIsCarousel] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setIsCarousel(false); // grid with 4 cards
      } else {
        setIsCarousel(true); // carousel active
        if (window.innerWidth <= 960) {
          setCardsToShow(1); // mobile
        } else {
          setCardsToShow(2); // tablet / desktop ≤ 2xl
        }
      }
    };

    handleResize(); // run on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    if (startIdx > 0) {
      setStartIdx((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (startIdx < jewels.length - cardsToShow) {
      setStartIdx((prev) => prev + 1);
    }
  };

  const visibleJewels = isCarousel
    ? jewels.slice(startIdx, startIdx + cardsToShow)
    : jewels;

  return (
    <section className="bg-gray-200 w-screen p-10 md:p-20 flex flex-col justify-center items-center overflow-hidden">
      {/* Show arrows only in carousel mode */}
      {isCarousel && (
        <div className="flex self-end mb-5 gap-3">
          <button
            onClick={handlePrev}
            disabled={startIdx === 0}
            className={`p-2 rounded-full bg-white shadow-md transition ${
              startIdx === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={startIdx >= jewels.length - cardsToShow}
            className={`p-2 rounded-full bg-white shadow-md transition ${
              startIdx >= jewels.length - cardsToShow ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRight />
          </button>
        </div>
      )}

      <div className={`grid gap-7 items-stretch ${isCarousel ? `grid-cols-${cardsToShow}` : 'grid-cols-4'}`}>
        {visibleJewels.map((jewel, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center h-full">
            <div className="max-w-[380px] w-full h-full text-center bg-white rounded-2xl shadow-lg flex flex-col items-center justify-between p-10 min-h-[400px] gap-10 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex flex-col gap-2 max-h-130">
                <p className="font-medium text-nowrap [font-size:clamp(1.25rem,2vw+0.5rem,1.8rem)]">
                  {jewel.title}
                </p>
                <p className="font-medium text-nowrap [font-size:clamp(1rem,1.5vw+0.25rem,1.15rem)]">
                  {jewel.subtitle}
                </p>
                <p className="font-medium [font-size:clamp(1rem,1.8vw+0.25rem,1.2rem)]">
                  {jewel.desc}
                </p>
              </div>
              <Image
                src={jewel.img}
                alt={jewel.alt}
                width={300}
                height={300}
                className="object-contain rounded-2xl"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

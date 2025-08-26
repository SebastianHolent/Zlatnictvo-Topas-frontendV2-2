import Link from "next/link.js";
import FeatureGrid from "@/components/services.js";
import JewelShowcase from "../components/jewelShowcase.js";
import { ArrowRight, Instagram, Facebook, Phone } from "lucide-react";

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <section className="relative pt-8 pb-16 overflow-hidden xl:pb-16">
                <div className="relative z-10 grid items-center max-w-screen-3xl px-5 gap-8 mx-auto sm:px-6 xl:px-8 xl:grid-cols-2 xl:gap-0">
                    {/* Left Content */}
                    <div className="flex flex-col items-center max-w-2xl mx-auto xl:items-start">
                        <h1 className="font-semibold text-center xl:text-left font-display text-slate-900 [font-size:clamp(2.2rem,4vw+1rem,3.5rem)]">
                            Poctivé šperkárske <br /> remeslo pre Vás
                        </h1>
                        <p className="mt-6 leading-8 text-center xl:text-left text-slate-700 [font-size:clamp(1rem,1.2vw+0.5rem,1.1rem)]">
                            Všetky aktivity Zlatníctva Topas sa sústredia na to najdôležitejšie, plniť priania klientov. S ohľadom na ich požiadavky prinášame len šperky najvyššej kvality podľa predstáv zákazníka.
                        </p>
                        <div className="flex flex-wrap items-center justify-center mt-10 gap-y-6 gap-x-10 xl:justify-start">
                            <Link
                                href="/e-shop"
                                className="h-11 border text-black hover:brightness-95 inline-flex items-center rounded-full gap-2.5 justify-center px-7 py-3 text-lg font-semibold leading-none outline-offset-2 transition-all duration-200 ease-in-out active:transition-none hover:scale-105"
                            >
                                Začnite nakupovať
                                <ArrowRight className="ml-2 h-5 w-5"/>
                            </Link>
                            <div className="flex gap-3 sm:gap-4">
                                <Link
                                    href="https://www.instagram.com/zlatnictvotopas/"
                                    target="_blank"
                                    className="flex items-center justify-center duration-200 border rounded-full h-11 w-11 border-slate-200 hover:bg-blue-200"
                                >
                                    <Instagram className="w-5 h-5"/>
                                </Link>
                                <Link
                                    href="https://www.facebook.com/TopasPresov"
                                    target="_blank"
                                    className="flex items-center justify-center duration-200 border rounded-full h-11 w-11 border-slate-200 hover:bg-blue-200"
                                >
                                    <Facebook className="w-5 h-5"/>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="">
                        <div className="relative rounded-2xl bg-slate-50">
                            <img    
                                src="/WORK.webp"
                                alt="Elegant woman wearing gold jewelry"
                                className="object-cover object-center w-full h-[600px] md:h-[700px] xl:h-[550px] rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex flex-col items-center">
            <JewelShowcase/>
            <div className="my-30">
                <div className="w-dvw text-center pb-7">
                    <h1 className="text-4xl font-semibold md:text-5xl lg:text-6xl">NÁŠ PRÍSTUP</h1>
                </div> 
                <div className="px-4 sm:px-10 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-md text-center md:text-lg lg:text-2xl">Všetko čo robíme je premyslené do posledného detailu.</h2>
                            <h2 className="text-md text-center md:text-lg lg:text-2xl">Všetko od prvého návrhu až po dokončený šperk.</h2>
                        </div>
                    </div>
                </div>
            <div className="flex w-screen items-center justify-center ">
                <FeatureGrid/>
            </div>
            </div>
            </div>
            </main>
    );
}


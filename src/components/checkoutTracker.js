import { usePathname } from "next/navigation";

export default function CheckoutTracker() {
  const pathname = usePathname();

  const steps = [
    { label: "Košík", path: "/kosik" },
    { label: "Kontaktné údaje", path: "/kontaktne-udaje" },
    { label: "Doprava a platba", path: "/doprava-a-platba" },    
    { label: "Dokončenie", path: "/dokoncenie-objednavky" },
  ];

  return (
    <div className="flex justify-center gap-10 md:gap-20 my-12">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = pathname === step.path;

        return (
          <div key={stepNumber} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium transition-all ${
                isActive
                  ? "bg-black text-white border-black"
                  : "border-gray-300"
              }`}
            >
              {stepNumber}
            </div>
            <span className="mt-1 text-[10px] text-nowrap min-[400px]:text-xs">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

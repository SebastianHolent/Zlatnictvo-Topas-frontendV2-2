'use client';

const features = [
  {
    title: 'CERTIFIKÁT KVALITY',
    img: 'https://0e7c1408d2.clvaw-cdnwnd.com/dfd4121fffda7fe9125e7764c0c15a2e/200000016-392c13a261/ICON%20Certificate.png?ph=0e7c1408d2',
    description: 'Garancia čistoty, váhy a rýdzosti kovu a kameňa ako doklad pre Vás.',
  },
  {
    title: 'REŠPEKTUJEME PRIANIA KLIENTOV',
    img: 'https://0e7c1408d2.clvaw-cdnwnd.com/dfd4121fffda7fe9125e7764c0c15a2e/200000015-18ae019a75/ICON%20People.png?ph=0e7c1408d2',
    description: 'Vaše myšlienky a predstavy prezentujte priamo nášmu zlatníkovi.',
  },
  {
    title: 'NAJKVALITNEJŠÍ MATERIÁL',
    img: 'https://0e7c1408d2.clvaw-cdnwnd.com/dfd4121fffda7fe9125e7764c0c15a2e/200000013-05229061ad/ICON%20Ingot.png?ph=0e7c1408d2',
    description: 'Biele, žlté či červené zlato, platina a len to najlepšie pre našich zákazníkov.',
  },
  {
    title: 'ZÁKAZKOVÁ VÝROBA',
    img: 'https://0e7c1408d2.clvaw-cdnwnd.com/dfd4121fffda7fe9125e7764c0c15a2e/200000020-2995b2a8fd/ICON%20Work.png?ph=0e7c1408d2',
    description: 'Rozmery, farba, typ alebo rozmer šperku a drahokamu je len na Vás.',
  },
  {
    title: 'OPRAVY NA POČKANIE',
    img: 'https://0e7c1408d2.clvaw-cdnwnd.com/dfd4121fffda7fe9125e7764c0c15a2e/200000017-56a0f579b6/ICON%20Clock-6.png?ph=0e7c1408d2',
    description: 'Poškodené alebo nalomené šperky? Možnosť opravy do 24 hodín.',
  },
  {
    title: 'VÝKUP ZLATA',
    img: 'https://0e7c1408d2.clvaw-cdnwnd.com/dfd4121fffda7fe9125e7764c0c15a2e/200000019-1f5a32053b/ICON%20Buy.png?ph=0e7c1408d2',
    description: 'Vykupované za hotovosť alebo akékoľvek produkty z našej širokej ponuky.',
  },
];

export default function FeatureGrid() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 m-10 gap-6 max-w-7xl"
    >
      {features.map((f, i) => (
              <div
                key={i}
                className="group relative flex flex-col items-center text-center p-6 backdrop-blur-lg bg-white"
              >
                <div className="z-[-1] rounded-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500" />
                <img src={f.img} className="size-20 mb-4 drop-shadow-lg" alt={f.title} />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm ">{f.description}</p>
              </div>
      ))}
    </div>
  );
}

import ShopNavigation from "@/components/shopNavigation";
import Breadcrumb from "@/components/breadcrumb";
import RecentlyViewed from "@/components/recentlyviewed";
import ProductGallery from "@/components/ProductGallery";
import ProductDetails from "@/components/ProductDetails";
import ProductMetadata from "@/components/ProductMetadata";
import { useState } from "react";
import { sdk } from "@/lib/sdk";

export async function getStaticPaths() {
  const { products } = await sdk.store.product.list({
    fields: `*variants.calculated_price`,
  });
  return {
    paths: products.map((product) => ({
      params: { handle: product.handle },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const handle = params.handle;
  const res = await fetch(`http://localhost:9000/store/${handle}`, {
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY,
    },
  });
  const product = await res.json();

  const { product_categories: parentCategories } = await sdk.store.category.list({
    fields: "id,name,handle",
    parent_category_id: "null",
  });
  const { product_categories: allCategories } = await sdk.store.category.list({
    fields: "id,name,handle,parent_category_id",
  });

  return {
    props: {
      product: product.product,
      parentCategories: parentCategories ?? [],
      allCategories: allCategories ?? [],
    },
    revalidate: 60,
  };
}

export default function Slug({ product, parentCategories, allCategories }) {
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  if (!product) return <div>Produkt sa nepodarilo načítať</div>;

  return (
    <>
      <ShopNavigation parentCategories={parentCategories} allCategories={allCategories} />

      {isAddedToCart && (
        <div className="relative bg-[#d7e8de] text-black px-4 py-2 rounded shadow">
          Produkt bol pridaný do košíku
        </div>
      )}

      <main className="px-4">
        <Breadcrumb product={product} />
        <div className="flex flex-col lg:flex-row justify-center items-center gap-10 my-10">
          <ProductDetails
            product={product}
            onAddToCart={() => {
              setIsAddedToCart(true);
              setTimeout(() => setIsAddedToCart(false), 2000);
            }}
          />
          <ProductGallery product={product} />
        </div>
      </main>

      <div className="bg-gray-100 py-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-5">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Popis a vlastnosti šperku
          </h2>
          <p className="text-lg font-medium">{product.title}</p>
          <p className="mt-6 text-sm sm:text-base">{product.description}</p>
          <ProductMetadata product={product} />
        </div>
      </div>

      <RecentlyViewed product={product} />
    </>
  );
}

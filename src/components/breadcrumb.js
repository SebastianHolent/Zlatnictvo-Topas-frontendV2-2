import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ product }) {
  const categories = product.categories || [];

  const childCategory = categories.find(cat => cat.parent_category_id) || null;

  const parentCategory =
    (childCategory && childCategory.parent_category) ||
    categories.find(cat => !cat.parent_category_id) ||
    null;

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-[10px] sm:text-sm text-gray-600 pt-5">
      <Link href="/e-shop" className="hover:underline">
        E-shop
      </Link>
      <ChevronRight className="w-4 h-4" />

      {parentCategory && (
        <>
          <Link href={`/e-shop/${parentCategory.handle}`} className="hover:underline">
            {parentCategory.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
        </>
      )}

      {childCategory && (
        <>
          <Link href={`/e-shop/${parentCategory.handle}/${childCategory.handle}`} className="hover:underline">
            {childCategory.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
        </>
      )}

      <span className="text-gray-800">{product.title}</span>
    </nav>
  );
}

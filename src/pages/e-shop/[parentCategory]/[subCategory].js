import { sdk } from "@/lib/sdk";
import ShopNavigation from "@/components/shopNavigation";
import ListProducts from "@/components/listProducts";

export async function getStaticPaths() {
  const { product_categories } = await sdk.store.category.list();

  const paths = product_categories.flatMap((parent) => {
    return (parent.category_children || []).map((child) => ({
      params: {
        parentCategory: parent.handle,
        subCategory: child.handle,
      },
    }));
  });

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
    const categoryHandle = params.subCategory;

    const { product_categories } = await sdk.store.category.list({
        handle: categoryHandle,
    });


    if (!product_categories.length) {
        return { notFound: true };
    }

    const categoryId = product_categories[0].id;

    const { products } = await sdk.store.product.list({
        category_id: [categoryId],
        fields: `*variants.calculated_price, +variants.inventory_quantity`,
    });
    const productsWithStock = products.filter(product =>
        product.variants?.some(variant =>
          variant.manage_inventory === false || (variant.inventory_quantity || 0) > 0
        )
      );  

    const { product_categories: parentCategories } = await sdk.store.category.list({
        fields: "id,name,handle",
        parent_category_id: "null",
    });
    const { product_categories: allCategories } = await sdk.store.category.list({
        fields: "id,name,handle,parent_category_id",
    });


    return {
        props: {
            productsWithStock,
            category: product_categories[0],
            parentCategories: parentCategories ?? [], 
            allCategories: allCategories ?? []
        },
        revalidate: 60,
    };
}

export default function SubCategory({ productsWithStock, category, parentCategories, allCategories}){
    return(
        <>
            <ShopNavigation parentCategories={parentCategories} allCategories={allCategories}/>
            <ListProducts products={ productsWithStock } category={ category }/>
        </>   
    )
}
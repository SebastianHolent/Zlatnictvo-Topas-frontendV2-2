import ListProducts from "@/components/listProducts";
import ShopNavigation from "@/components/shopNavigation";
import { sdk } from "@/lib/sdk";

export async function getServerSideProps() {
 try{

      const { products } = await sdk.store.product.list({
        fields: `*variants.calculated_price, +variants.inventory_quantity`,
      });
      const { product_categories: parentCategories } = await sdk.store.category.list({
        fields: "id,name,handle",
        parent_category_id: "null",
      });
      const { product_categories: allCategories } = await sdk.store.category.list({
        fields: "id,name,handle,parent_category_id",
      });

      return {
        props: { products, parentCategories: parentCategories ?? [], allCategories: allCategories ?? [] }
      }
 }
 catch(error){
      console.log(error)

      return{
        props: {
          products: [],
          parentCategories: [],
          allCategories: [],
        }
      }
 }
}

export default function EshopHome({ products, parentCategories, allCategories }) {
  return(
    <main>
      <ShopNavigation parentCategories={parentCategories} allCategories={allCategories}/>
      <ListProducts products={ products }/>
    </main>
  )
}
"use client";
import { Product } from "@/app/api/utils/productData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

async function getAllProducts(): Promise<Product[] | undefined> {
  const response = await fetch(`/api/products`);
  return response.json();
}

export default function Page() {
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: [`products`],
    queryFn: () => getAllProducts(),
  });

  return (
    products && (
      <div>
        <div>Number of Products: {products.length}</div>
        {products.map((product: Product) => {
          return <div key={product.energyStarId}>{product.energyStarId}</div>;
        })}
      </div>
    )
  );
}

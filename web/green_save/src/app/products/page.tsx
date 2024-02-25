"use client";
import { WaterHeater } from "@/app/api/utils/productData";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function getAllProducts(): Promise<WaterHeater[] | undefined> {
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
      <div className="mt-32 text-white">
        <div>Number of Products: {products.length}</div>
        {products.slice(0, 10).map((product: WaterHeater) => {
          return <div key={product.id}>{product.id}</div>;
        })}
      </div>
    )
  );
}

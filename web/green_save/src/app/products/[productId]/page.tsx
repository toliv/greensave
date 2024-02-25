"use client";
import { WaterHeater } from "@/app/api/utils/productData";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function getProductById(id: string): Promise<WaterHeater | undefined> {
  const response = await fetch(`/api/products/${id}`);
  return response.json();
}

export default function Page({ params }: { params: { productId: string } }) {
  const queryClient = useQueryClient();
  const { data: waterHeater } = useQuery({
    queryKey: [`products/${params.productId}`],
    queryFn: () => getProductById(params.productId),
  });

  return (
    waterHeater && (
      <div className="mt-40 text-white flex justify-around ">
        <div>
          <div>Product ID: {waterHeater.id}</div>
          <div>Model Name: {waterHeater.modelName}</div>
          <div>Power Source: {waterHeater.heaterType}</div>
        </div>
      </div>
    )
  );
}

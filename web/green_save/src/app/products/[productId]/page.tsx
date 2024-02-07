"use client";
import { Product } from "@/app/api/utils/readProductFile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

async function getProductById(id: string): Promise<Product | undefined> {
  const response = await fetch(`/api/products/${id}`);
  return response.json();
}

export default function Page({ params }: { params: { productId: string } }) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [`products/${params.productId}`],
    queryFn: () => getProductById(params.productId),
  });

  const imageLoader = () => {
    const url = query.data?.skuData.mediaJson.images[0].url;
    return `${url}_600.jpg`;
  };

  return (
    query.data && (
      <div>
        <div>Product ID: {query.data.energyStarId}</div>
        <div>Price: {query.data.skuData.priceInCents / 100}</div>
        <div>Model Name: {query.data.skuData.modelName}</div>
        <div>Power Source: {query.data.skuData.powerSource}</div>
        <div>
          <Image
            loader={imageLoader}
            src="me.png"
            alt="Picture of the author"
            width={600}
            height={600}
          />
        </div>
      </div>
    )
  );
}

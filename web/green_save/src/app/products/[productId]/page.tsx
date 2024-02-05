'use client'
import { useQuery, useQueryClient } from "@tanstack/react-query"

async function getProductById(id: string) {
  const response = await fetch(`/api/products/${id}`);
  return response.json();
}

export default function Page({ params }: { params: { productId: string } }) {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: [`products/${params.productId}`], queryFn: () => getProductById(params.productId) })

  console.log(query.data);

  return <div>My Post: {params.productId}</div>
}
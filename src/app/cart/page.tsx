'use client';

import toast from 'react-hot-toast';
import useFetch from '../../../hooks/useFetch';
import { CartItem } from './style';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const { data, loading, error } = useFetch<CartItem>(apiUrl + 'carts', {
    headers: { Authorization: 'Bearer ' + localStorage.access_token },
  });

  if (error) {
    toast.error(error.message ?? 'Error fetch carts');
  }

  const handleAddQuantity = async (id: string) => {
    try {
      const response = await fetch(apiUrl + 'carts/' + id, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + localStorage.access_token },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast.success('Quantity added');
    } catch (error: any) {
      toast.error(error.message ?? 'Error add quantity');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  } else if (data?.data.length === 0) {
    return <p>No items in cart</p>;
  } else {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Cart</h1>
            <div className="mt-4">
              {data?.data.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img src={item.imgUrl} alt={item.name} className="h-24 w-24 object-cover" />
                  <div>
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <p className="text-lg text-gray-500">Rp {item.price}</p>
                    <p className="text-lg text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

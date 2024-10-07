'use client';

import React from 'react';
import toast from 'react-hot-toast';
import useFetch from '../../../hooks/useFetch';
import { CartItem } from './style';
import NavigationBar from '../../../components/NavigationBar';
import { IoTrashOutline } from 'react-icons/io5';
import Link from 'next/link';
import getTotalPrice from '../../../helpers/getTotalPrice';
import getTotalQuantity from '../../../helpers/getTotalQuantity';
import numberFormat from '../../../helpers/numberFormat';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const router = useRouter();
  const { data, loading, error, retrigger } = useFetch<CartItem>(apiUrl + 'carts', {
    headers: { Authorization: 'Bearer ' + localStorage.access_token },
  });

  if (error) {
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'error' implicitly has an 'any' type.
    toast.error(error.message ?? 'Error fetch carts');
  }

  const handleIncreaseQuantity = async (id: number) => {
    try {
      const response = await fetch(apiUrl + 'carts/' + id + '/increase', {
        method: 'PATCH',
        headers: { Authorization: 'Bearer ' + localStorage.access_token },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw responseBody;
      }

      retrigger();
    } catch (error) {
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'error' implicitly has an 'any' type.
      toast.error(error.message ?? 'Error add quantity');
    }
  };

  const handleDecreaseQuantity = async (id: number) => {
    try {
      const response = await fetch(apiUrl + 'carts/' + id + '/decrease', {
        method: 'PATCH',
        headers: { Authorization: 'Bearer ' + localStorage.access_token },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw responseBody;
      }

      retrigger();
    } catch (error) {
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'error' implicitly has an 'any' type.
      toast.error(error.message ?? 'Error decrease quantity');
    }
  };

  const handleDeleteCart = async (id: number) => {
    try {
      const response = await fetch(apiUrl + 'carts/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + localStorage.access_token },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw responseBody;
      }

      toast.success('1 produk telah dihapus');
      retrigger();
    } catch (error) {
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'error' implicitly has an 'any' type.
      toast.error(error.message ?? 'Error delete cart');
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(apiUrl + 'transactions', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + localStorage.access_token },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw responseBody;
      }

      const responseBody = await response.json();
      toast.success('Berhasil checkout');
      router.push(responseBody.data.snapUrl);

      retrigger();
    } catch (error) {
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'error' implicitly has an 'any' type.
      toast.error(error.message ?? 'Error checkout');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <NavigationBar />
      <main className="container mx-auto px-12 py-8">
        <h1 className="mb-5 text-xl leading-8 font-extrabold tracking-tight sm:text-2xl">Keranjang</h1>

        <div className="flex-1 flex gap-5 items-start">
          <div className="bg-white rounded-lg overflow-hidden p-8 flex-1">
            <div className="flex flex-col gap-4">
              {/* {loading && (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              )} */}
              {data?.data.map((item, index) => (
                <>
                  <div key={index} className="flex gap-4">
                    <img src={item.imgUrl} alt={item.name} className="h-28 w-28 object-cover" />

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex-1 flex justify-between">
                        <h2 className="">{item.name}</h2>
                        <p className="font-bold text-lg">{'Rp' + numberFormat(item.price)}</p>
                      </div>
                      <div className="flex gap-5 self-end">
                        <button onClick={() => handleDeleteCart(item.cartId)}>
                          <IoTrashOutline size={20} className="text-slate-500" />
                        </button>
                        <div className="flex gap-2 border rounded-md px-1 py-1">
                          <button
                            disabled={item.quantity <= 1}
                            className={`${
                              item.quantity <= 1 ? 'hover:cursor-not-allowed' : 'hover:bg-slate-100'
                            } px-2 rounded`}
                            onClick={() => handleDecreaseQuantity(item.cartId)}
                          >
                            -
                          </button>
                          <p className="w-5 text-center">{item.quantity}</p>
                          <button
                            className="hover:bg-slate-100 px-2 rounded"
                            onClick={() => handleIncreaseQuantity(item.cartId)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index !== data.data.length - 1 && <hr />}
                </>
              ))}
              {data?.data.length === 0 && !loading && (
                <div className="mx-auto flex gap-5">
                  <img
                    src="https://assets.tokopedia.net/assets-tokopedia-lite/v2/backfunnel/kratos/4d27af6a.svg"
                    alt="empty-cart"
                  />
                  <div className=" flex flex-col items-start py-8">
                    <p className="font-bold text-2xl">Wah, keranjang belanjamu kosong</p>
                    <p>Yuk, isi dengan barang-barang impianmu!</p>
                    <Link href="/" className="mt-2 bg-primary text-white font-bold py-2 px-4 sm:px-10 rounded-md">
                      Mulai Belanja
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden p-4 w-1/4">
            <p className="font-bold text-lg">Ringkasan Belanja</p>
            <div className="mt-2 flex justify-between items-center">
              <p className="p-0 m-0">Total</p>
              <p className="font-bold text-lg">
                {data && data.data && data?.data.length > 0 ? `Rp${numberFormat(getTotalPrice(data?.data))}` : '-'}
              </p>
            </div>
            <hr className="mb-5 my-3" />
            <button
              onClick={handleCheckout}
              disabled={!!(data && data.data && !data.data.length)}
              className={`${
                !!(data && data.data && !data.data.length) ? 'text-slate-400 bg-slate-200' : 'text-white bg-primary'
              } font-bold py-1.5 w-full rounded-md`}
            >{`Beli ${
              data && data.data && data.data.length > 0 ? '(' + getTotalQuantity(data.data) + ')' : ''
            }`}</button>
          </div>
        </div>
      </main>
    </div>
  );
}

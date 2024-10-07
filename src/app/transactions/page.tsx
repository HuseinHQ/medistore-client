'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NavigationBar from '../../../components/NavigationBar';
import useFetch from '../../../hooks/useFetch';
import { Transaction } from './types';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import moment from 'moment';
import 'moment/locale/id';
import numberFormat from '../../../helpers/numberFormat';
import toast from 'react-hot-toast';
import { Spinner } from '@nextui-org/react';

moment.locale('id');

const status = [
  { label: 'Semua', value: 'all' },
  { label: 'Menunggu Pembayaran', value: 'pending' },
  { label: 'Berhasil', value: 'success' },
  { label: 'Gagal', value: 'failure' },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';
  const { data, loading, error } = useFetch<Transaction>(apiUrl + `transactions?status=${currentStatus}`, {
    headers: { Authorization: 'Bearer ' + localStorage.access_token },
  });

  const handleInvoice = async (id: number) => {
    try {
      const response = await fetch(apiUrl + `transactions/${id}/invoice`, {
        headers: { Authorization: 'Bearer ' + localStorage.access_token },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw responseBody;
      }

      const result = await response.json();
      router.push(apiUrl + result.data.pdfPath);
    } catch (error) {
      console.log(error);
    }
  };

  if (error) {
    console.log(error);
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'error' implicitly has an 'any' type.
    toast.error(error.message ?? 'Error fetch transactions');
  }

  const handleStatusChange = (value: string) => {
    router.push(pathname + '?status=' + value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="container mx-auto px-12 py-8 flex-grow flex flex-col">
        <h1 className="font-bold text-2xl">Daftar Transaksi</h1>
        <div className="mt-5 flex-grow min-h-full border rounded-xl p-4">
          <div className="flex items-center gap-4">
            <p className="font-semibold">Status</p>
            {status.map((item, index) => (
              <button
                key={index}
                className={`border px-3 py-1 rounded-md ${
                  currentStatus === item.value
                    ? 'border-primary text-primary bg-primary-50'
                    : 'border-gray-300 text-gray-700 bg-white'
                }`}
                onClick={() => handleStatusChange(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-5">
            {loading && <Spinner />}
            {data?.data.map((transaction) => (
              <div key={transaction.id} className="rounded-lg shadow p-4">
                <div className="flex items-center gap-3">
                  <HiOutlineShoppingBag className="text-primary" />
                  <p className="text-sm font-semibold">Belanja</p>
                  <p className="text-sm">{moment(transaction.createdAt).format('D MMM YYYY')}</p>
                  <div
                    className={`${
                      transaction.status === 'success'
                        ? 'bg-green-50 text-green-500'
                        : transaction.status === 'failure'
                        ? 'bg-red-50 text-red-500'
                        : 'bg-primary-50 text-primary'
                    } text-xs font-semibold px-2 py-1 rounded-md`}
                  >
                    {transaction.status === 'success'
                      ? 'Berhasil'
                      : transaction.status === 'failure'
                      ? 'Gagal'
                      : 'Menunggu Pembayaran'}
                  </div>
                  <p className="text-sm text-slate-500">{transaction.orderId}</p>
                </div>

                <div className="flex items-center mt-3 justify-between">
                  <div className="flex gap-3">
                    <img
                      src={transaction.TransactionDetails[0].Item.imgUrl}
                      alt=""
                      className="h-20 w-20 object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="line-clamp-1 font-bold">{transaction.TransactionDetails[0].Item.name}</p>
                      <p className="text-sm">
                        {transaction.TransactionDetails[0].quantity +
                          ' barang x Rp' +
                          numberFormat(transaction.TransactionDetails[0].price)}
                      </p>
                      {transaction.TransactionDetails.length > 1 && (
                        <p className="text-sm text-slate-500 mt-auto">{`+${
                          transaction.TransactionDetails.length - 1
                        } produk lainnya`}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-l ps-5 pr-2">
                    <p className="text-sm">Total Belanja</p>
                    <p className="font-bold">Rp{numberFormat(transaction.total)}</p>
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  {transaction.status === 'success' && (
                    <button
                      onClick={() => handleInvoice(transaction.id)}
                      className="bg-primary text-sm text-white font-semibold py-1.5 w-36 rounded-md"
                    >
                      Invoice
                    </button>
                  )}
                  {transaction.status === 'pending' && (
                    <button
                      onClick={() => router.push(transaction.snapUrl)}
                      className="bg-primary text-sm text-white font-semibold py-1.5 w-36 rounded-md"
                    >
                      Bayar
                    </button>
                  )}
                </div>
              </div>
            ))}
            {data?.data.length === 0 && !loading && (
              <div className="flex items-center justify-center h-full">
                <p className="text-lg">Tidak ada transaksi</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

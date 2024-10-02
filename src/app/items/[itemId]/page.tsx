import { notFound } from 'next/navigation';
import ItemClientComponent from './ItemClientComponent';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getItem = async (id: string) => {
  try {
    const response = await fetch(apiUrl + 'items/' + id);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default async function ItemPage({ params }: { params: { itemId: string } }) {
  const item = await getItem(params.itemId);

  if (!item) {
    notFound();
  }

  return <ItemClientComponent item={item} />;
}

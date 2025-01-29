"use client";
import { cn } from "@heroui/react";
import Header from "./components/places/Header";
import Banner from "./components/places/Banner";
import PlaceListItem from "./components/places/place-list-item";
import { useEffect, useState } from "react";
import { getProductsApi } from "./services/productServices";
import React from "react";
import { useAppContext } from "./context/StoreContext";

type Item = {
  name: string;
  id: string;
  quantity: number;
  image: string;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const { setAppState } = useAppContext();

  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    setLoading(true);
    try {
      const getProducts = await getProductsApi();
      if (getProducts?.data.success) {
        setProducts(getProducts.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = (newItem: Item) => {
    setAppState((prevState) => {
      const existingItemIndex = prevState.cartItems.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex !== -1) {
        // If item exists, update quantity
        const updatedCart = prevState.cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
        return { ...prevState, cartItems: updatedCart };
      } else {
        // If item does not exist, add new item
        return { ...prevState, cartItems: [...prevState.cartItems, newItem] };
      }
    });
  };

  return (
    <div className=" font-[family-name:var(--font-geist-sans)]">
      <main className="">
        {/* header */}
        <Header />
        <Banner />
        {/* products */}
        <div className=" my-8">
          <h4 className=" text-[32px] px-4 sm:px-8">Products</h4>
          <div
            className={cn(
              "my-auto grid max-w-7xl grid-cols-1 gap-5 p-4 sm:px-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            )}
          >
            {products.map((product) => (
              <PlaceListItem
                key={product.id}
                {...product}
                editItem={(e) => {
                  addItemToCart({
                    name: e.name,
                    id: e.id,
                    quantity: Number(e.quantity),
                    image: e.image,
                  });
                }}
                deleteItem={(e) => {}}
              />
            ))}
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

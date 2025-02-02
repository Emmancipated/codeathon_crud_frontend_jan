"use client";

import { Button, cn, Image, Skeleton } from "@heroui/react";
import React from "react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { IsAuthenticated } from "@/app/services/userServices";
import { div } from "framer-motion/client";

export type PlaceListItemColor = {
  name: string;
  hex: string;
};

export type PlaceItem = {
  id: string;
  name: string;
  href: string;
  price: number;
  quantity?: number;
  isNew?: boolean;
  rating?: number;
  ratingCount?: number;
  description?: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PlaceListItemProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "id"
> & {
  isPopular?: boolean;
  isLoading?: boolean;
  removeWrapper?: boolean;
  editItem: (value: any) => void;
  removeItem?: boolean;
  deleteItem: (value: string) => void;
} & PlaceItem;

const PlaceListItem = React.forwardRef<HTMLDivElement, PlaceListItemProps>(
  (
    {
      id,
      name,
      price,
      rating,
      isLoading,
      quantity,
      description,
      image,
      removeWrapper,
      className,
      createdAt,
      updatedAt,
      editItem,
      deleteItem,
      ...props
    },
    ref
  ) => {
    const [isLiked, setIsLiked] = React.useState(false);
    const path = usePathname();
    const auth = IsAuthenticated();
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full flex-none flex-col gap-3 cursor-pointer group font-[family-name:var(--font-quick-sand)]",
          {
            "rounded-none bg-background shadow-none": removeWrapper,
          },
          className
        )}
        {...props}
        onClick={() => console.log("I was cicked")}
      >
        <Button
          isIconOnly
          className="absolute right-3 top-3 z-20 bg-background/60 backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
          radius="full"
          size="sm"
          variant="flat"
          onPress={() => setIsLiked(!isLiked)}
        >
          <Icon
            className={cn("text-default-900/50", {
              "text-danger-400": isLiked,
            })}
            icon="solar:heart-bold"
            width={16}
          />
        </Button>

        {path !== "/admin/products" && auth && (
          <div className="absolute bottom-3 left-3 right-3 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              className="w-full bg-[#2A254B] text-white"
              radius="lg"
              size="md"
              onPress={() =>
                editItem({ name, price, rating, description, image, id })
              }
            >
              Add to Cart
            </Button>
          </div>
        )}
        <Image
          isBlurred
          isZoomed
          alt={name}
          className="aspect-square w-full hover:scale-110"
          isLoading={isLoading}
          src={image}
        />

        <div className="mt-1 flex flex-col gap-2 px-1">
          {isLoading ? (
            <div className="my-1 flex flex-col gap-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200" />
              </Skeleton>
              <Skeleton className="mt-3 w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200" />
              </Skeleton>
              <Skeleton className="mt-4 w-2/5 rounded-lg">
                <div className="h-3 w-2/5 rounded-lg bg-default-300" />
              </Skeleton>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-1">
                <h3 className=" text-xl font-medium text-default-700 font-[family-name:var(--font-smooch-sans)]">
                  {name}
                </h3>
                {rating !== undefined ? (
                  <div className="flex items-center gap-1">
                    <Icon
                      className="text-default-500"
                      icon="solar:star-bold"
                      width={16}
                    />
                    <span className="text-small text-default-500">
                      {rating}
                    </span>
                  </div>
                ) : null}
              </div>
              {description ? (
                <div className="description-container">
                  <p className="text-small text-default-500 description">
                    {description}
                  </p>
                </div>
              ) : null}
              <p className="text-xl  font-medium text-default-500 font-[family-name:var(--font-smooch-sans)]">
                ${price}
              </p>

              {path === "/admin/products" && (
                <div className="flex gap-2">
                  <Button
                    className="w-full bg-[#2A254B] text-white"
                    radius="lg"
                    size="md"
                    onPress={() =>
                      editItem({
                        name,
                        price,
                        description,
                        image,
                        id,
                        quantity,
                      })
                    }
                  >
                    Edit Product
                  </Button>
                  <Button
                    className="w-full bg-red-600 text-white"
                    radius="lg"
                    size="md"
                    onPress={() => deleteItem(id)}
                  >
                    Delete Product
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);

PlaceListItem.displayName = "PlaceListItem";

export default PlaceListItem;

"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import bg from "@/public/bg.png";
import {
  Button,
  cn,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Form,
  Input,
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { v4 as uuidv4 } from "uuid";
import {
  createProductsApi,
  deleteProductApi,
  getAdminProductsApi,
  getProductsApi,
  updateProductApi,
} from "@/app/services/productServices";
import PlaceListItem from "@/app/components/places/place-list-item";

import { generateRandomNumber } from "@/app/utils/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { getClientData } from "@/app/services/userServices";
import { useRouter } from "next/navigation";

function Products() {
  const [errors, setErrors] = React.useState({});
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [placement, setPlacement] = React.useState<
    "left" | "top" | "right" | "bottom"
  >("left");
  const generateId = () => uuidv4();
  const navigate = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [response, setResponse] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [editData, setEditData] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    quantity: "",
    id: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setEditData({
        name: "",
        image: "",
        description: "",
        price: "",
        quantity: "",
        id: "",
      });
    }
    const token = getClientData();
    setToken(token);
  }, [isOpen]);

  const getProducts = async () => {
    setLoading(true);

    try {
      const getProducts = await getAdminProductsApi(token);
      if (getProducts?.data?.success) {
        setProducts(getProducts.data.data);
      } else {
        navigate.push("/auth/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (placement: "left" | "top" | "right" | "bottom") => {
    setPlacement(placement);
    onOpen();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = generateId();
    const rating = generateRandomNumber();
    const href = `/product/${id}`;
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (editData.name.length > 0) {
      await editProductFn(data);
    } else {
      await createProductFn(data, id, rating, href);
    }
  };

  const createProductFn = async (
    data: {
      [k: string]: FormDataEntryValue;
    },
    id: string,
    rating: number,
    href: string
  ) => {
    if (
      !data.name ||
      !data.image ||
      !data.quantity ||
      !data.description ||
      !data.price
    ) {
      setErrors({
        name: "Title is required",
        image: "Image URL is required",
        quantity: "Quantity is required",
        description: "Description is required",
        price: "Price is required",
      });

      return;
    }
    const payload = {
      id,
      name: data.name,
      rating,
      href,
      price: data.price,
      description: data.description,
      image: data.image,
      quantity: data.quantity,
    };
    setLoading(true);
    try {
      const createProduct = await createProductsApi(payload);
      if (createProduct?.data?.success) {
        const getProducts = await getProductsApi();
        if (getProducts?.data?.success) {
          setProducts(getProducts.data.data);
        }
        setResponse("success");
      } else {
        setResponse(createProduct?.response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      onClose();
      // onOpenChange();
      setEditData({
        name: "",
        image: "",
        description: "",
        price: "",
        quantity: "",
        id: "",
      });
    }
  };

  const editProductFn = async (data: { [k: string]: FormDataEntryValue }) => {
    if (
      !editData.name ||
      !editData.image ||
      !editData.quantity ||
      !editData.description ||
      !editData.price
    ) {
      setErrors({
        name: "Title is required",
        image: "Image URL is required",
        quantity: "Quantity is required",
        description: "Description is required",
        price: "Price is required",
      });
      return;
    }
    const payload = {
      id: editData.id,
      name: data.name,
      // rating,
      // href,
      price: data.price,
      description: data.description,
      image: data.image,
      quantity: data.quantity,
    };
    setLoading(true);
    try {
      const editProduct = await updateProductApi(payload, editData.id);
      if (editProduct?.data?.success) {
        const getProducts = await getProductsApi();
        if (getProducts?.data?.success) {
          setProducts(getProducts.data.data);
        } else {
        }
        setResponse("success");
      } else {
        setResponse(editProduct?.response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      onClose();
      setEditData({
        name: "",
        image: "",
        description: "",
        price: "",
        quantity: "",
        id: "",
      });
    }
  };
  useEffect(() => {
    const loadProducts = async () => {
      getProducts();
    };
    loadProducts();
  }, []);

  const [isOpenRes, setIsOpenRes] = useState(false);

  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };

  const editProduct = (e: any) => {
    setEditData({
      name: e.name,
      image: e.image,
      description: e.description,
      price: e.price,
      quantity: e.quantity,
      id: e.id,
    });
    onOpenChange();
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const createProduct = await deleteProductApi(id);
      if (createProduct?.data?.success) {
        const getProducts = await getProductsApi();
        if (getProducts?.data?.success) {
          setProducts(getProducts.data.data);
        }
        setResponse("success");
      } else {
        setResponse(createProduct?.response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" bg-[#2A254B] text-white font-[family-name:var(--font-roboto)] py-4 px-4 sm:px-8 flex flex-col gap-14 sm:grid sm:grid-cols-2 items-center">
        <AnimatePresence>
          {isOpenRes && (
            <motion.div
              initial={{ x: 300, opacity: 0 }} // Slide in from the right
              animate={{ x: 0, opacity: 1 }} // Position when visible
              exit={{ x: 300, opacity: 0 }} // Slide out to the right
              transition={{ duration: 0.3 }} // Animation duration
              className="fixed right-5 top-5 z-50 w-[300px] rounded-lg bg-white p-4 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="flex-grow">
                  <h4 className="font-medium text-default-900">Notification</h4>
                  <p className="text-sm text-default-700">
                    This is your notification message.
                  </p>
                </div>
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  onPress={toggleNotification}
                >
                  ✖
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Drawer
          isOpen={isOpen}
          placement={placement}
          onOpenChange={onOpenChange}
        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">
                  {editData.name ? "Edit" : "Create"} Product
                </DrawerHeader>
                <DrawerBody>
                  <Form
                    className="w-full "
                    validationErrors={errors}
                    onSubmit={onSubmit}
                  >
                    <Input
                      label="Name"
                      labelPlacement="outside"
                      name="name"
                      placeholder="Enter product name"
                      // classNames={{ label: "text-white/90 dark:text-white/90" }}
                      className=" w-full"
                      defaultValue={editData.name}
                    />
                    <Input
                      label="Image"
                      labelPlacement="outside"
                      name="image"
                      placeholder="Enter product image URL"
                      // classNames={{ label: "text-white/90 dark:text-white/90" }}
                      className=" w-full"
                      defaultValue={editData.image}
                    />
                    <Input
                      label="Quantity"
                      labelPlacement="outside"
                      name="quantity"
                      placeholder="Enter product quantity"
                      type="number"
                      className=" w-full"
                      defaultValue={editData.quantity}
                    />
                    <Input
                      label="Price"
                      labelPlacement="outside"
                      name="price"
                      placeholder="Enter product price"
                      type="number"
                      className=" w-full"
                      defaultValue={editData.price}
                    />
                    <Textarea
                      // className="max-w-xs"
                      name="description"
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Enter your description"
                      variant="bordered"
                      className=" w-full"
                      defaultValue={editData.description}
                    />
                    <Button
                      type="submit"
                      variant="flat"
                      className="w-full bg-[#2A254B] text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner />
                      ) : editData.name ? (
                        "Edit"
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </Form>
                  {/* <div onClick={closeModal}>dlcodjdjjdd</div> */}
                </DrawerBody>
              </>
            )}
          </DrawerContent>
        </Drawer>

        <div>
          <h4 className=" text-[38px] ">
            The furniture brand for the future, with timeless designs
          </h4>
          <p className=" text-[24px] my-10">
            A new era in eco friendly furniture with Avelon, the French luxury
            retail brand with nice fonts, tasteful colors and a beautiful way to
            display things digitally using modern web technologies.
          </p>
          <Button
            className="w-full text-[#2A254B] bg-white"
            radius="lg"
            size="lg"
            onPress={() => handleOpen("right")}
          >
            Create Product
          </Button>
        </div>
        <div>
          <Image src={bg} alt="bg" priority />
        </div>
      </div>

      {/* products */}
      <div className=" my-8">
        <h4 className=" text-[32px] px-4 sm:px-8">Products</h4>
        <div
          className={cn(
            "my-auto grid max-w-7xl grid-cols-1 gap-5 p-4 sm:px-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          )}
        >
          {products.map((item) => (
            <PlaceListItem
              key={item.id}
              {...item}
              isLoading={loading}
              editItem={(e) => editProduct(e)}
              id={item.id}
              deleteItem={(id: string) => deleteProduct(id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;

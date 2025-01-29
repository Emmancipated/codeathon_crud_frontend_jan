"use client";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Badge,
} from "@heroui/react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";
import { useAppContext } from "@/app/context/StoreContext";
import { IsAuthenticated } from "@/app/services/userServices";

export default function Header() {
  const auth = IsAuthenticated();
  const { appState } = useAppContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [placement, setPlacement] = React.useState<
    "left" | "top" | "right" | "bottom"
  >("left");

  const handleOpen = (placement: "left" | "top" | "right" | "bottom") => {
    setPlacement(placement);
    onOpen();
  };

  return (
    <>
      <div>
        <div className=" flex justify-between px-4 py-5">
          <h1 className=" text-xl font-[family-name:var(--font-smooch-sans)]">
            Emmanuel
          </h1>

          <div className=" flex gap-x-3 cursor-pointer">
            {!auth && (
              <div className=" flex gap-x-3">
                <h4>
                  <Link href={"/auth/login"}>Login</Link>
                </h4>
                <h4>
                  <Link href={"/auth/register"}>Sign up</Link>
                </h4>
              </div>
            )}
            <Icon
              className={cn(
                "text-default-900/50 text-black"
                //    {
                //   "text-danger-400": isLiked,
                // }
              )}
              icon="mynaui:search"
              width={24}
            />
            <Badge
              color="secondary"
              content={appState.cartItems.length}
              isInvisible={appState.cartItems.length > 0 ? false : true}
              shape="circle"
            >
              <Icon
                className={cn(
                  "text-default-900/50 text-black"
                  //    {
                  //   "text-danger-400": isLiked,
                  // }
                )}
                icon="mynaui:cart-check"
                width={24}
              />
            </Badge>
            <Icon
              className={cn(
                "text-default-900/50 text-black sm:hidden"
                //    {
                //   "text-danger-400": isLiked,
                // }
              )}
              icon="mynaui:list"
              width={24}
              onClick={() => handleOpen("left")}
            />
          </div>
        </div>
        <div className=" h-[1px] bg-[#f1eaea]"></div>
        <div className=" hidden sm:flex justify-center items-center py-4 font-[family-name:var(--font-quick-sand)] gap-x-3">
          <h4>
            <Link href={"#"}>Plant Pots</Link>
          </h4>
          <h4>
            <Link href={"#"}>Ceramics</Link>
          </h4>
          <h4>
            <Link href={"#"}>Tables</Link>
          </h4>
          <h4>
            <Link href={"#"}>Art Works</Link>
          </h4>
          <h4>
            <Link href={"#"}>Cutlery</Link>
          </h4>
        </div>
      </div>

      <Drawer isOpen={isOpen} placement={placement} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Categories
              </DrawerHeader>
              <DrawerBody>
                <div className=" flex flex-col justify-center items-center py-4 font-[family-name:var(--font-quick-sand)] gap-x-3">
                  <h4>
                    <Link href={"#"}>Plant Pots</Link>
                  </h4>
                  <h4>
                    <Link href={"#"}>Ceramics</Link>
                  </h4>
                  <h4>
                    <Link href={"#"}>Tables</Link>
                  </h4>
                  <h4>
                    <Link href={"#"}>Art Works</Link>
                  </h4>
                  <h4>
                    <Link href={"#"}>Cutlery</Link>
                  </h4>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

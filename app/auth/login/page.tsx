"use client";
import { Button } from "@heroui/button";
import { cn, Form, Input, Spinner } from "@heroui/react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import React from "react";
import AlertComponent from "@/app/components/places/AlertComponent";
import { authenticateUser, loginUserApi } from "@/app/services/userServices";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Icon } from "@iconify/react";

export default function Login() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const navigate = useRouter();
  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };

  function SetParam() {
    const param = useSearchParams();
    const token = param?.get("token");
    const tokenFaceBook = param?.get("tokenFacebook");
    useEffect(() => {
      // if (!token || !tokenFaceBook) return;
      if (token) authenticateUser(token);
      if (tokenFaceBook) authenticateUser(tokenFaceBook);
      if (token || tokenFaceBook) navigate.push("/");
    }, [token]);
    return <></>;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // Initialize an empty errors object
    const newErrors: Record<string, string> = {};

    // Check for missing fields and set errors for specific fields
    if (!data.email) newErrors.email = "Email is required";
    if (!data.password) newErrors.password = "Password is required";

    // If there are errors, update the state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);

    // Clear errors if validation passes
    setErrors({});

    const payload = {
      email: data.email,
      password: data.password,
    };
    try {
      const loginUser = await loginUserApi(payload);
      if (loginUser?.data?.success) {
        setResponse({
          responseType: "success",
          responseMessage: "Login Successful",
        });
        setIsOpenRes(true);
        //route to login
      } else {
        setResponse({
          responseType: "fail",
          responseMessage: loginUser?.response?.data?.message,
        });
        setIsOpenRes(true);
      }
      if (loginUser?.data?.success) {
        navigate.push("/");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Suspense>
      <SetParam />
      <div className=" font-[family-name:var(--font-geist-sans)] px-4 sm:px-6">
        <div className=" my-[5rem] mx-auto max-w-[30rem]">
          <h2 className=" my-4 text-xl font-semibold">Login to your account</h2>
          <Form
            className="w-full "
            validationErrors={errors}
            onSubmit={onSubmit}
          >
            <Input
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter email address"
              type="email"
              className=" w-full my-2"
            />
            <Input
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Enter password"
              type="password"
              className=" w-full my-2"
            />

            <Button
              type="submit"
              variant="flat"
              className="w-full bg-[#2A254B] text-white my-4"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Submit"}
            </Button>

            <Button
              type="button"
              variant="flat"
              className="w-full bg-[#2A254B] text-white my-2"
              disabled={loading}
              onPress={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`;
              }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {" "}
                  <Icon
                    className={cn("text-default-900/50 text-white")}
                    icon="mynaui:brand-google"
                    width={24}
                  />
                  Login with Google
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="flat"
              className="w-full bg-[#2A254B] text-white my-2"
              disabled={loading}
              onPress={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/facebook`;
              }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {" "}
                  <Icon
                    className={cn("text-default-900/50 text-white")}
                    icon="mynaui:brand-facebook"
                    width={24}
                  />
                  Login with Facebook
                </>
              )}
            </Button>
          </Form>

          <div className="flex justify-between items-center">
            <div>
              <Link href="/auth/register"> Sign up</Link>
            </div>
            <div>
              <Link href="/auth/reset-password"> Reset password</Link>
            </div>
          </div>
        </div>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        <AlertComponent
          isOpenRes={isOpenRes}
          toggleNotification={toggleNotification}
          responseType={response.responseType}
          responseMessage={response.responseMessage}
        />
      </div>
    </Suspense>
  );
}

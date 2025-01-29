"use client";
import { Button } from "@heroui/button";
import { Form, Input, Spinner } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import AlertComponent from "@/app/components/places/AlertComponent";
import { createUserApi } from "@/app/services/userServices";
import { useRouter } from "next/navigation";

export default function Register() {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = useState(false);
  const generateId = () => uuidv4();
  const [isOpenRes, setIsOpenRes] = useState(false);
  const [response, setResponse] = useState({
    responseType: "",
    responseMessage: "",
  });
  const navigate = useRouter();

  const toggleNotification = () => {
    setIsOpenRes(!isOpenRes);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const id = generateId();
    // Initialize an empty errors object
    const newErrors: Record<string, string> = {};

    // Check for missing fields and set errors for specific fields
    if (!data.name) newErrors.name = "Name is required";
    if (!data.surname) newErrors.surname = "Surname is required";
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
      id: id,
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password,
      role: "user",
    };
    try {
      const createUser = await createUserApi(payload);
      if (createUser?.data?.success) {
        setResponse({
          responseType: "success",
          responseMessage: "User created successfully, please login",
        });
        setIsOpenRes(true);
        //route to login
      } else {
        setResponse({
          responseType: "fail",
          responseMessage: createUser?.response?.data?.message,
        });
        setIsOpenRes(true);
      }
      if (
        createUser?.response?.data?.message ===
          "Email already exists, please sign in" ||
        "User registered successfully"
      ) {
        navigate.push("/auth/login");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" font-[family-name:var(--font-geist-sans)] px-4 sm:px-6">
      <div className=" my-[5rem] mx-auto max-w-[30rem]">
        <h2 className=" my-4 text-xl font-semibold">Create your account</h2>
        <Form className="w-full " validationErrors={errors} onSubmit={onSubmit}>
          <Input
            label="Name"
            labelPlacement="outside"
            name="name"
            placeholder="Enter your first name"
            className=" w-full my-2"
          />
          <Input
            label="Surname"
            labelPlacement="outside"
            name="surname"
            placeholder="Enter your first surname"
            // classNames={{ label: "text-white/90 dark:text-white/90" }}
            className=" w-full my-2"
          />
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
        </Form>

        <div className="flex justify-between items-center">
          <div>
            <Link href="/auth/login"> Login</Link>
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
  );
}

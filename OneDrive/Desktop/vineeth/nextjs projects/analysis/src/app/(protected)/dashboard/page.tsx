"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";

const DashboardPage = () => {
  const { user } = useUser(); //it provides access to the current users object, which contains all the data for a single user in your application and provides methods to manage their account.
  return (
    <div>{user?.firstName}</div>
  );
};

export default DashboardPage;

"use client"
import React from "react";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";
const DashboardPage = () => {

  const { user } = useUser();
  return (
    <div>
      <h1>Welcome {user?.firstName} {" "} {user?.lastName}</h1>
      <span>User id: {user?.id}</span>
    </div>
  );
};

export default DashboardPage;

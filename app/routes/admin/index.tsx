import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HomeIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import {
  Form,
  json,
  useLoaderData,
  Outlet,
  Link,
  NavLink,
  redirect,
} from "remix";
import type { LoaderFunction } from "remix";

import { getUser, requireUserId } from "~/session.server";
import { useUser, hasRole } from "~/utils";
import { Role } from "@prisma/client";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Dashboard", to: "/admin", icon: HomeIcon },
  { name: "Users", to: "/admin/users", icon: HomeIcon },
];


export default function AdminPage() {

  return (
    <>
      Admin Index
    </>
  );
}

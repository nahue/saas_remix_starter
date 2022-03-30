import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HomeIcon, MenuIcon, XIcon, UsersIcon } from "@heroicons/react/outline";
import {
  json,
  Outlet,
  NavLink,
  redirect,
  useLoaderData,
  MetaFunction,
  Link,
} from "remix";
import type { LoaderFunction } from "remix";

import { getUser, requireUserId } from "~/session.server";
import { hasRole, useUser } from "~/utils";
import { Role, User } from "@prisma/client";
import { getUserById, listUsers } from "~/models/user.server";

export const meta: MetaFunction = () => {
  return {
    title: "Admin - Users",
  };
};

type LoaderData = {
  users: User[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const users = await listUsers();
  return json<LoaderData>({
    users,
  });
};

export default function UsersPage() {
  const { users } = useLoaderData() as LoaderData;
  const loggedInUser = useUser()

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Users Administration
        </h1>
      </div>
      <div className="py-4 mx-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Fist Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Last Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Roles
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                  {user.email}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {user.firstName}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {user.lastName}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <div className="flex gap-2">
                    {user.roles.map((role) => {
                      return (
                        <span className="capitalize" key={role}>
                          {role.toLocaleLowerCase()}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="relative flex gap-4 py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                  <Link to={`/admin/users/${user.id}`} className="text-indigo-600 hover:text-indigo-900">
                    Edit<span className="sr-only">, {user.name}</span>
                  </Link>
                  {loggedInUser && loggedInUser.id != user.id && (
                    <a href="#" className="text-red-600 hover:text-indigo-900">
                      Remove<span className="sr-only">, {user.name}</span>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

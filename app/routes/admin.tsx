import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HomeIcon, MenuIcon, XIcon, UsersIcon } from "@heroicons/react/outline";
import { json, Outlet, NavLink, redirect } from "remix";
import type { LoaderFunction } from "remix";

import { getUser, requireUserId } from "~/session.server";
import { hasRole, useUser } from "~/utils";
import { Role } from "@prisma/client";
import { getUserById } from "~/models/user.server";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Dashboard", to: "/admin/", icon: HomeIcon },
  { name: "Users", to: "/admin/users", icon: UsersIcon },
];

type LoaderData = {};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);;

  if (!hasRole(user, Role.ADMIN)) return redirect("/");

  return json<LoaderData>({});
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useUser();
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 flex md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacityfunction classNames(...classes) {
                return classes.filter(Boolean).join(' ')
              }-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex flex-col flex-1 w-full max-w-xs bg-gray-800">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 pt-2 -mr-12">
                  <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <img
                    className="w-auto h-8"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Workflow"
                  />
                </div>
                <nav className="px-2 mt-5 space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={classNames(
                              isActive
                                ? "text-gray-300"
                                : "text-gray-400 group-hover:text-gray-300",
                              "mr-4 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="flex flex-shrink-0 p-4 bg-gray-700">
                <a href="#" className="flex-shrink-0 block group">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block w-10 h-10 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">
                        {user.name}
                      </p>
                      <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">
                        View profile
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col flex-1 min-h-0 bg-gray-800">
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img
                className="w-auto h-8"
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                alt="Workflow"
              />
            </div>
            <nav className="flex-1 px-2 mt-5 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={classNames(
                          isActive
                            ? "text-gray-300"
                            : "text-gray-400 group-hover:text-gray-300",
                          "mr-3 h-6 w-6 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 p-4 bg-gray-700">
            <a href="#" className="flex-shrink-0 block w-full group">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block rounded-full h-9 w-9"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                    View profile
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 md:pl-64">
        <div className="sticky top-0 z-10 pt-1 pl-1 bg-gray-100 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

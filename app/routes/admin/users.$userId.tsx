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
  Form,
  ActionFunction,
  useActionData,
} from "remix";
import type { LoaderFunction } from "remix";

import { getUser, requireUserId } from "~/session.server";
import { hasRole, useUser } from "~/utils";
import { Role, User } from "@prisma/client";
import {
  createUser,
  getUserById,
  listUsers,
  updateUser,
} from "~/models/user.server";
import invariant from "tiny-invariant";

type LoaderData = {
  user: User | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const loggedInUser = await getUser(request);
  invariant(params.userId, "userId not found");

  //   if (!hasRole(loggedInUser, Role.ADMIN)) return redirect("/");

  const user = await getUserById(params.userId);
  console.log(user);
  return json<LoaderData>({
    user,
  });
};

type ActionData = {
  errors?: {
    id?: string;
    email?: string;
    name?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const loggedUserId = await requireUserId(request);

  const formData = await request.formData();
  const userId = formData.get("id");
  const email = formData.get("email");
  const name = formData.get("name");

  if (typeof email !== "string" || email.length === 0) {
    return json<ActionData>(
      {
        errors: {
          email: "Email is empty",
        },
      },
      { status: 400 }
    );
  }

  if (typeof name !== "string" || name.length === 0) {
    return json<ActionData>(
      {
        errors: {
          name: "Name is empty",
        },
      },
      { status: 400 }
    );
  }

  if (typeof userId !== "string" || userId.length === 0) {
    return json<ActionData>(
      {
        errors: {
          id: "User Id is empty",
        },
      },
      { status: 400 }
    );
  }

  const user = await updateUser(email, name);
  return json<ActionData>(
    {
      errors: {},
    },
    { status: 200 }
  );
};

export default function UserDetailPage() {
  const { user } = useLoaderData();
  const actionData = useActionData();
  console.log({ actionData });
  return (
    <div className="max-w-4xl px-4 mx-auto sm:px-6 md:px-8">
      User - {user.name}
      <Form method="post" className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>

            <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
              <input type="hidden" name="id" value={user.id} />
              <input type="hidden" name="email" value={user.email} />
              <div>
                <label>{user.email}</label>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Name"
                    defaultValue={user.name}
                  />
                </div>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

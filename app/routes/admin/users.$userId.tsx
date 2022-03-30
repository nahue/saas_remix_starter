import {
  json,
  useLoaderData,
  Form,
  ActionFunction,
  useActionData,
} from "remix";
import type { LoaderFunction } from "remix";

import { getUser, requireUserId } from "~/session.server";
import { User } from "@prisma/client";
import { getUserById, updateUser } from "~/models/user.server";
import invariant from "tiny-invariant";
import { Label } from "@radix-ui/react-label";

type LoaderData = {
  user: User | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  // const loggedInUser = await getUser(request);
  invariant(params.userId, "userId not found");
  return json<LoaderData>({
    user: await getUserById(params.userId),
  });
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    id?: string | undefined;
    email?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    about?: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
    about: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  // const loggedUserId = await requireUserId(request);

  const formData = await request.formData();
  const userId = formData.get("id");
  const email = formData.get("email");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const about = formData.get("about");

  if (typeof email !== "string" || email.length === 0) {
    return json<ActionData>(
      {
        fieldErrors: {
          email: "Email is empty",
        },
      },
      { status: 400 }
    );
  }

  if (typeof userId !== "string" || userId.length === 0) {
    return json<ActionData>(
      {
        fieldErrors: {
          id: "User Id is empty",
        },
      },
      { status: 400 }
    );
  }

  if (typeof firstName !== "string" || typeof lastName !== "string" || typeof about !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  await updateUser({ id: userId, firstName, lastName, about });
  return json<ActionData>({}, { status: 200 });
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
              <div className="sm:col-span-4">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <div className="flex mt-1 rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 sm:text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="username"
                    className="flex-1 block w-full min-w-0 border-gray-300 rounded-none rounded-r-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={user.email}
                    readOnly
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </Label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="First Name"
                    defaultValue={user.firstName}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </Label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Last Name"
                    defaultValue={user.lastName}
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700"
                >
                  About
                </label>
                <div className="mt-1">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={user.about}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Write a few sentences about yourself.
                </p>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

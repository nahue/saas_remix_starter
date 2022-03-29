import { MetaFunction } from "remix";

export const meta: MetaFunction = () => {
  return {
    title: "Admin - Index",
  };
};

export default function AdminPage() {
  return <>Admin Index</>;
}

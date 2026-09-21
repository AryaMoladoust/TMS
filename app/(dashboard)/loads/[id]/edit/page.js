import EditLoadForm from "@/components/loads/EditLoadForm";

async function getLoad(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/loads/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("بار پیدا نشد");
  }

  return res.json();
}

export default async function EditLoadPage({ params }) {
  const { id } = await params;
  const load = await getLoad(id);

  return <EditLoadForm load={load} />;
}
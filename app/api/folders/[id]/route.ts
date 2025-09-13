import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { findFolder, createFolder } from "@/lib/data";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const folder = findFolder(params.id);
  if (!folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }
  return NextResponse.json(folder);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { name } = await req.json();

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Invalid folder name" }, { status: 400 });
  }

  // Create folder using the proper data store function
  const result = createFolder(params.id, name.trim());

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error?.includes("already exists") ? 409 : 400 }
    );
  }

  revalidatePath("/");
  revalidatePath(`/folder/${params.id}`);
  return NextResponse.json({ success: true, folderId: result.folderId });
}

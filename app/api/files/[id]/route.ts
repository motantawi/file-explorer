import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { findFolder, createFile } from "@/lib/data";
import { basename } from "path";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const providedName = formData.get("name")?.toString();
  const parent = findFolder(params.id);

  if (!parent) {
    return NextResponse.json(
      { error: "Parent folder not found" },
      { status: 404 }
    );
  }

  let fileName: string;
  let shouldCreateFile = false;

  if (file) {
    // Handle file upload
    let rawName: string;

    if (providedName && providedName.trim()) {
      // If user provided a custom name, preserve the original file extension
      const originalExtension = file.name.split(".").pop()?.toLowerCase();
      const customName = providedName.trim();

      // Check if custom name already has an extension
      if (customName.includes(".")) {
        rawName = customName;
      } else {
        // Add the original extension to the custom name
        rawName = originalExtension
          ? `${customName}.${originalExtension}`
          : customName;
      }
    } else {
      // Use original file name
      rawName = file.name;
    }

    fileName = basename(rawName);
    shouldCreateFile = true;
  } else if (providedName && providedName.trim()) {
    // Handle text file creation
    fileName = basename(providedName.trim());
  } else {
    return NextResponse.json(
      { error: "Either file or name must be provided" },
      { status: 400 }
    );
  }

  if (!fileName) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  // Check if file already exists in the folder
  const existingFile = parent.children.find((child) => child.name === fileName);
  if (existingFile) {
    return NextResponse.json(
      { error: "File already exists in this folder" },
      { status: 409 }
    );
  }

  // For demo purposes, we'll store file data as base64 for images
  let fileData: string | undefined;
  let fileUrl: string | undefined;

  if (file && shouldCreateFile) {
    // Check if it's an image file
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const fileExtension = fileName.split(".").pop()?.toLowerCase();

    // Also check the original file type as a fallback
    const isImageByExtension =
      fileExtension && imageExtensions.includes(fileExtension);
    const isImageByMimeType = file.type && file.type.startsWith("image/");

    if (isImageByExtension || isImageByMimeType) {
      // Convert image to base64
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      fileData = `data:${file.type};base64,${base64}`;
    }
  }

  // Create file using the proper data store function
  const result = createFile(
    params.id,
    fileName,
    file ? file.size : fileName.length * 8,
    fileData,
    fileUrl
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath(`/folder/${params.id}`);
  return NextResponse.json({ success: true, fileId: result.fileId });
}

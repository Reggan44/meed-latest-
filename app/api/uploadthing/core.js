import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const f = createUploadthing();

const requireSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new UploadThingError("Unauthorized");
  return { userId: session.user.id };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  categoryImageUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(requireSession)
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "JB" };
    }),
  bannerImageUploader: f({ image: { maxFileSize: "2MB" } })
    .middleware(requireSession)
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "JB" };
    }),
  marketLogoUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(requireSession)
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "JB" };
    }),
  productImageUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(requireSession)
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "JB" };
    }),
  trainingImageUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(requireSession)
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "JB" };
    }),
  farmerProfileUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(requireSession)
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "JB" };
    }),
  customerProfileUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(requireSession)
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "JB" };
    }),
  storeLogoUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(requireSession)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "JB" };
    }),
  vendorProfileUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(requireSession)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "JB" };
    }),
  multipleProductsUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 4 },
  })
    .middleware(requireSession)
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "JB" };
    }),
};

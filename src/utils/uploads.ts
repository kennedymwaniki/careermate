/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import supabase from "./supabase";

async function uploadFiles(file: any) {
  console.log("Uploading file to Supabase Storage...");

  // Upload the file
  const { data, error } = await supabase.storage
    .from("careermate")
    .upload(file.name, file);

  if (error) {
    console.error("Error uploading file:", error);
    toast.error(`Error uploading file: ${error.message}`, {
      position: "top-right",
    });
    return null;
  }

  console.log("File uploaded successfully:", data);

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("careermate")
    .createSignedUrl(data.path, 60 * 60 * 24 * 365);

  if (signedUrlError) {
    console.error("Error generating signed URL:", signedUrlError);
    return data;
  }

  console.log("Signed URL generated successfully:", signedUrlData);

  return {
    ...data,
    signedUrl: signedUrlData.signedUrl,
  };
}

export default uploadFiles;

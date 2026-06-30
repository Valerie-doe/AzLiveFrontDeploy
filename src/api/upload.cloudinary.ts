export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();

  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary env variables missing");
  }

  formData.append("file", file);
  formData.append("upload_preset", "AZLive_upload"); // pas de ${}

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dj9qwddts/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error(data);
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
}
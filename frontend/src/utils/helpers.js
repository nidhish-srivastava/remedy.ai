import {  clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getCookie(){
  return document.cookie.split("accessToken=")[1].split(";")[0];
}

async function uploadImagetoCloudinary(file){
  const formData = new FormData();
  const upload_preset_name = "chat-app";
  formData.append("file", file);
  formData.append("upload_preset", upload_preset_name);
  const cloud_name = "dvlz73wcr";
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  return response.json();
}

export {getCookie,cn,uploadImagetoCloudinary}
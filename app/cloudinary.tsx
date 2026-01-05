"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function CloudinaryUploadWidget() {
  return (
    <div>
      <CldUploadWidget uploadPreset="next-cloudinary">
        {({ open }) => {
          return <button onClick={() => open()}>Upload an Image</button>;
        }}
      </CldUploadWidget>
    </div>
  );
}

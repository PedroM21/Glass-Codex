"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function CloudinaryUploadWidget({
  onUpload,
}: {
  onUpload: (url: string, publicId: string) => void;
}) {
  return (
    <div>
      <CldUploadWidget
        uploadPreset="next-cloudinary"
        options={{ folder: "game-design-journal" }}
        onSuccess={(result) => {
          const info = result.info as {
            secure_url: string;
            public_id: string;
          };

          onUpload(info.secure_url, info.public_id);
        }}
      >
        {({ open }) => {
          return (
            <button type="button" onClick={() => open()}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

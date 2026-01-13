"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function CloudinaryUploadWidget({
  onUpload,
  children,
}: {
  onUpload: (url: string, publicId: string) => void;
  children: (open: () => void) => React.ReactNode;
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
        {({ open }) => children(open)}
      </CldUploadWidget>
    </div>
  );
}

"use client";

import { useState } from "react";
import Button from "../ui/Button";
import CloudinaryUploadWidget from "@/app/cloudinary";
import { CreateCharacter } from "@/lib/services/api";
import { useRouter } from "next/navigation";
import { easeIn, motion } from "motion/react";

export default function CharacterModal() {
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    traits: "",
    flaws: "",
    imageURL: "",
  });

  const router = useRouter();
  const handleOpen = () => {
    setIsOpen(true);
    console.log("Opened");
  };
  const handleClose = () => setIsOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...formData,
      traits: formData.traits
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      flaws: formData.flaws
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        throw new Error("No auth token found");
      }
      const data = await CreateCharacter(payload, token);
      setIsOpen(false);
    } catch (error) {
      console.log("Failed to create character: ", error);
    }
  };

  return (
    <div>
      <Button label="Create Character" onClick={handleOpen} />
      {isOpen && (
        <motion.div className="bg-black/60 h-screen absolute w-full top-0 left-0 z-15">
          <motion.div
            initial={{ scale: 0.2 }}
            animate={{ scale: 1 }}
            transition={{ ease: easeIn, duration: 0.3 }}
            className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] border-2 border-[#327842] bg-[#26374d] p-8 rounded-md"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="bg-[#DDe6ed] text-black p-2"
              ></input>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-[#DDe6ed] text-black p-2"
                placeholder="Role"
              />
              <input
                type="text"
                id="traits"
                name="traits"
                value={formData.traits}
                onChange={handleChange}
                className="bg-[#DDe6ed] text-black p-2"
                placeholder="Traits"
              />
              <input
                type="text"
                id="flaws"
                name="flaws"
                value={formData.flaws}
                onChange={handleChange}
                className="bg-[#DDe6ed] text-black p-2"
                placeholder="Flaws"
              />
              <CloudinaryUploadWidget
                onUpload={(url, publicId) => {
                  setFormData((prev) => ({
                    ...prev,
                    imageURL: url,
                  }));

                  setImageUrl(url);
                  setImagePublicId(publicId);
                }}
              />
              <Button type="submit" label="Submit" />
              <div onClick={handleClose}>
                <Button type="button" label="Close" />
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

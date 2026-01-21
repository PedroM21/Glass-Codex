"use client";

import { useState } from "react";
import Button from "../ui/Button";
import CloudinaryUploadWidget from "@/app/cloudinary";
import { CreateCharacter } from "@/lib/services/api";
import { useRouter } from "next/navigation";
import { easeIn, motion } from "motion/react";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function CharacterModal({
  onCharacterCreated,
}: {
  onCharacterCreated: (character: any) => void;
}) {
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
      onCharacterCreated(data.character);
      setIsOpen(false);
    } catch (error) {
      console.log("Failed to create character: ", error);
    }
  };

  return (
    <div>
      <div className="text-center xl:text-start">
        <Button
          label="Create Character"
          color="bg-[#f1cf79]"
          textColor="text-[#2B2B2B]"
          onClick={handleOpen}
        />
      </div>
      {isOpen && (
        <motion.div className="bg-black/60 h-screen absolute w-full top-0 left-0 z-15">
          <motion.div
            initial={{ scale: 0.2 }}
            animate={{ scale: 1 }}
            transition={{ ease: easeIn, duration: 0.3 }}
            className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] border-2 border-[#f1cf79] bg-[#1b3153] p-8 rounded-2xl w-1/3"
          >
            <h1 className="text-center text-[25px] py-4 px-2 text-white">
              Create Your Character
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="bg-[#eff5f6] w-1/2 mx-auto text-[#2B2B2B] p-2 rounded-2xl"
              ></input>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-[#eff5f6] w-1/2 mx-auto text-[#2B2B2B] p-2 rounded-2xl"
                placeholder="Role"
              />
              <input
                type="text"
                id="traits"
                name="traits"
                value={formData.traits}
                onChange={handleChange}
                className="bg-[#eff5f6] w-1/2 mx-auto text-[#2B2B2B] p-2 rounded-2xl"
                placeholder="Traits"
              />
              <input
                type="text"
                id="flaws"
                name="flaws"
                value={formData.flaws}
                onChange={handleChange}
                className="bg-[#eff5f6] w-1/2 mx-auto text-[#2B2B2B] p-2 rounded-2xl"
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
              >
                {(open) => (
                  <div
                    onClick={open}
                    className="border-2 border-[#f1cf79] bg-transparent text-white rounded-2xl text-center p-4 cursor-pointer w-1/2 mx-auto"
                  >
                    <UploadFileIcon sx={{ fontSize: "60px" }} />
                    <p>Click to upload an image.</p>
                  </div>
                )}
              </CloudinaryUploadWidget>
              <div className="flex justify-center gap-8">
                <Button
                  type="submit"
                  label="Submit"
                  color="bg-[#f1cf79]"
                  textColor="text-[#2B2B2B]"
                />
                <Button
                  type="button"
                  label="Close"
                  color="bg-[#2B2B2B]"
                  textColor="text-white"
                  onClick={handleClose}
                />
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

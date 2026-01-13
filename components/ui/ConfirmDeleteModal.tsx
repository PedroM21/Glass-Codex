"use client";

import { useState } from "react";
import Button from "./Button";
import WarningIcon from "@mui/icons-material/Warning";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-10 flex justify-center items-center">
      <div className="bg-[#E1D7C3] p-8 text-[#2B2B2B] space-y-2 border-2 border-[#8C7A5A]">
        <div className="text-center">
          <WarningIcon />
        </div>
        <div className="text-center">
          <h1 className="text-[20px] font-semibold">
            Permanently Delete Character?
          </h1>
          <p className="">This action cannot be undone.</p>
        </div>
        <div className="flex justify-evenly">
          <Button
            label="Cancel"
            color="bg-transparent"
            textColor="text-[#2B2B2B]"
            onClick={onCancel}
          ></Button>
          <Button
            label="Delete"
            color="bg-[#8C3F3F]"
            textColor="text-white"
            onClick={onConfirm}
          ></Button>
        </div>
      </div>
    </div>
  );
}

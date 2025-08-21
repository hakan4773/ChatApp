"use client";

import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";
import React, { useState } from "react";
import { toast } from "react-toastify";

type NotesProps = {
  setOpenNewNoteState: React.Dispatch<React.SetStateAction<boolean>>;
  setNotes: React.Dispatch<React.SetStateAction<Notes[]>>;
};

type Notes = {
  id: string;
  title: string;
  content: string;
};

function AddNewNotes({ setOpenNewNoteState,setNotes }: NotesProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<Notes>({
    id: "",
    title: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > 100) return;
    if (name === "content" && value.length > 1000) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpenNewNoteState(false);
    }
  };

  const AddNewNote = async () => {
    if (!user?.id) {
      toast.error("Kullanıcı bulunamadı. Lütfen giriş yapın.");
      return;
    }
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Başlık ve içerik boş olamaz.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data,error } = await supabase.from("Notes").insert({
        title: formData.title,
        content: formData.content,
        user_id: user.id,
      }).select();

      if (error) {
        toast.error("Not eklenemedi. Tekrar deneyin.");
      } else {
        toast.success("Not başarıyla eklendi.");
        setNotes((prev) => [data[0], ...prev]);
        setFormData({ id: "", title: "", content: "" });
        setOpenNewNoteState(false);
      }
    } catch (err) {
      toast.error("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50 bg-gray-500/30 backdrop-blur-sm safe-area-padding"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white/80 dark:bg-gray-800/80 p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold mb-4 dark:text-gray-200">
          Yeni Not Ekle
        </h2>
        <input
          onChange={handleChange}
          name="title"
          value={formData.title}
          className="w-full mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          type="text"
          placeholder="Başlık"
          aria-label="Not başlığı"
          maxLength={100}
        />
        <textarea
          onChange={handleChange}
          name="content"
          value={formData.content}
          className="w-full mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          rows={4}
          placeholder="Not içeriğini buraya yazın..."
          aria-label="Not içeriği"
          maxLength={1000}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={AddNewNote}
            disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
            className={`p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700 transition-colors ${
              isSubmitting || !formData.title.trim() || !formData.content.trim()
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            aria-label="Not ekle"
          >
            Ekle
          </button>
          <button
            onClick={() => setOpenNewNoteState(false)}
            className="p-3 bg-red-500 text-white rounded-md hover:bg-red-600 active:bg-red-700 transition-colors"
            aria-label="İptal"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNewNotes;
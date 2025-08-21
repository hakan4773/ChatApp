import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Notes = {
  id: string;
  title: string;
  content: string;
};

type UpdateNoteModalProps = {
  note: Notes;
  setOpenUpdateState: React.Dispatch<React.SetStateAction<boolean>>;
  setNotes: React.Dispatch<React.SetStateAction<Notes[]>>;
};


export default function UpdateNoteModal({ note, setOpenUpdateState, setNotes }: UpdateNoteModalProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<Notes>({
    id: note.id,
    title: note.title,
    content: note.content,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > 100) return;
    if (name === "content" && value.length > 1000) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!user?.id) return;
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Başlık ve içerik boş olamaz.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("Notes")
        .update({ title: formData.title, content: formData.content })
        .eq("id", formData.id);

      if (error) {
        toast.error("Not güncellenemedi.");
      } else {
        toast.success("Not başarıyla güncellendi!");
        setNotes((prev) =>
          prev.map((n) => (n.id === formData.id ? { ...n, ...formData } : n))
        );
        setOpenUpdateState(false);
      }
    } catch (err) {
      toast.error("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/30 backdrop-blur-sm">
      <div className="bg-white/80 dark:bg-gray-800/80 p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold mb-4 dark:text-gray-200">Notu Düzenle</h2>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Başlık"
          maxLength={100}
          className="w-full mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={4}
          placeholder="Not içeriğini buraya yazın..."
          maxLength={1000}
          className="w-full mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleUpdate}
            disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
            className={`p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700 transition-colors ${
              isSubmitting || !formData.title.trim() || !formData.content.trim()
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Güncelle
          </button>
          <button
            onClick={() => setOpenUpdateState(false)}
            className="p-3 bg-red-500 text-white rounded-md hover:bg-red-600 active:bg-red-700 transition-colors"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

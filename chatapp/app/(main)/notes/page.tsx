"use client"
import React, { useEffect, useState } from 'react'
import AddNewNotes from './components/AddNewNotes';
import { supabase } from '@/app/lib/supabaseClient';
import { useUser } from '@/app/context/UserContext';
import { FiTrash2 } from 'react-icons/fi';
import { PencilIcon } from '@heroicons/react/24/outline';
import UpdateNoteModal from './components/UpdateModal';

type Notes = {
  id: string;
  title: string;
  content: string;
};

function Page() {
  const { user } = useUser();
  const [openNewNoteState, setOpenNewNoteState] = useState(false);
  const [notes, setNotes] = useState<Notes[]>([]);
  const [openUpdateState, setOpenUpdateState] = useState(false);
  const [editingNote, setEditingNote] = useState<Notes | null>(null);

  useEffect(() => {
    const getNotes = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from("Notes")
        .select("*")
        .eq("user_id", user.id).order("created_at", { ascending: false });

      if (error) {
        console.error("Notlar getirilemedi", error.message);
        return;
      }

      setNotes(data ?? []);
    };
    
    getNotes();
  }, [user?.id]);

    const handleDelete = async (id: string) => {
      if (!user?.id) return; 
    const confirmDelete = window.confirm("Bu notu silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("Notes")
      .delete()
      .eq("id", id)
      .eq("user_id", user?.id);

    if (error) {
      console.error("Not silinemedi", error.message);
      return;
    }

    setNotes((prev) => prev.filter((n) => n.id !== id));
  };



  return (
 <div
      className="w-full flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b 
      bg-[url('/bg.jpg')] dark:bg-[url('/darkbg.jpg')]
      bg-cover bg-center from-gray-100 to-gray-200 
      dark:from-gray-900 dark:to-gray-800 min-h-screen"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Notlar
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          onClick={() => setOpenNewNoteState(true)}
          className=" rounded-2xl shadow bg-white  hover:border-blue-400 transition"
        >
          <div className="lg:h-44 flex bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md text-center justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-600 ">
            <span className="cursor-pointer text-6xl text-gray-500 dark:text-gray-400 hover:scale-105">
              +
            </span>
          </div>
        </div>

        {notes.map((note) => (
          <div
            key={note.id}
            className="relative bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100 dark:active:bg-gray-500 transition-colors"
          >

            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => { setEditingNote(note); setOpenUpdateState(true); }}
                className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition"
              >
                <PencilIcon  className="text-blue-600 dark:text-blue-400 w-5 h-5" />
              </button>
              <button
                 onClick={() => handleDelete(note.id)}
                className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition"
              >
                <FiTrash2 size={18} className="text-red-600 dark:text-red-400" />
              </button>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
              {note.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-2 line-clamp-4">
              {note.content}
            </p>
          </div>
        ))}
      </div>

      {openNewNoteState && (
        <AddNewNotes  setNotes={setNotes} setOpenNewNoteState={setOpenNewNoteState} />
      )}
      {openUpdateState && editingNote && (
     <UpdateNoteModal
        note={editingNote}
        setOpenUpdateState={setOpenUpdateState}
        setNotes={setNotes}
  />
)}
    </div>
  );
}
export default Page;
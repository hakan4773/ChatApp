"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";
import { MagnifyingGlassIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
// type User = {
//   name: string;
//   email: string;
//   password: string;
//   id: number;
//   created_at?: string;
// };

// function Main() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [users, setUsers] = useState<User[]>([]);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);

//   const getUsers = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("users")
//         .select("*")
//         .order("created_at", { ascending: false });
      
//       if (error) throw error;
//       if (data) setUsers(data as User[]);
//     } catch (error) {
//       console.error("Kullanıcılar yüklenirken hata:", error);
//       alert("Kullanıcılar yüklenirken hata oluştu");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = () => {
//     if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
//       alert("Lütfen tüm alanları doldurun.");
//       return false;
//     }
//     return true;
//   };

//   const addUser = async () => {
//     if (!validateForm()) return;
    
//     setLoading(true);
//     try {
//       // Email kontrolü (veritabanı seviyesinde)
//       const { data: existing } = await supabase
//         .from("users")
//         .select("email")
//         .eq("email", formData.email)
//         .single();
      
//       if (existing) {
//         alert("Bu email zaten kayıtlı.");
//         return;
//       }

//       const { data, error } = await supabase
//         .from("users")
//         .insert([formData])
//         .select();
      
//       if (error) throw error;
//       if (data) {
//         setUsers(prev => [...prev, ...data as User[]]);
//         setFormData({ name: "", email: "", password: "" });
//       }
//     } catch (error) {
//       console.error("Kullanıcı eklenirken hata:", error);
//       alert("Kullanıcı eklenirken hata oluştu");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEditing = (user: User) => {
//     setFormData({
//       name: user.name,
//       email: user.email,
//       password: user.password,
//     });
//     setEditingId(user.id);
//   };

//   const updateUser = async () => {
//     if (!validateForm() || editingId === null) return;
    
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("users")
//         .update(formData)
//         .eq("id", editingId)
//         .select();
      
//       if (error) throw error;
//       if (data) {
//         setUsers(prev => 
//           prev.map(user => 
//             user.id === editingId ? { ...user, ...formData } : user
//           )
//         );
//         setFormData({ name: "", email: "", password: "" });
//         setEditingId(null);
//       }
//     } catch (error) {
//       console.error("Kullanıcı güncellenirken hata:", error);
//       alert("Kullanıcı güncellenirken hata oluştu");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteUser = async (id: number) => {
//     if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    
//     setLoading(true);
//     try {
//       const { error } = await supabase.from("users").delete().eq("id", id);
//       if (error) throw error;
//       setUsers(prev => prev.filter(user => user.id !== id));
//     } catch (error) {
//       console.error("Kullanıcı silinirken hata:", error);
//       alert("Kullanıcı silinirken hata oluştu");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     editingId ? updateUser() : addUser();
//   };

//   useEffect(() => {
//     getUsers();
//   }, []);

//   return (
//     <div className="flex flex-col w-full p-8 shadow-lg rounded-lg">
//       <form className="mb-8" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Ad"
//           className="border p-2 rounded w-full mb-4"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           className="border p-2 rounded w-full mb-4"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Şifre"
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//           className="border p-2 rounded w-full mb-4"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
//           disabled={loading}
//         >
//           {loading ? "İşleniyor..." : editingId ? "Güncelle" : "Ekle"}
//         </button>
//       </form>

//       {loading && users.length === 0 ? (
//         <p>Yükleniyor...</p>
//       ) : (
//         <div className="space-y-4">
//           {users.map((user) => (
//             <div key={user.id} className="border p-4 rounded">
//               <h2 className="text-lg font-bold">{user.name}</h2>
//               <p className="text-gray-600">{user.email}</p>
//               <div className="flex justify-between mt-4 gap-2">
//                 <button
//                   onClick={() => deleteUser(user.id)}
//                   className="bg-red-500 text-white p-2 rounded flex-1 hover:bg-red-600 transition"
//                   disabled={loading}
//                 >
//                   Sil
//                 </button>
//                 <button
//                   onClick={() => startEditing(user)}
//                   className="bg-yellow-500 text-white p-2 rounded flex-1 hover:bg-yellow-600 transition"
//                   disabled={loading}
//                 >
//                   Düzenle
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

function Main() {
 

 return (
  
    <div className="bg-gray-100 min-h-screen  flex flex-col rounded-xl shadow-lg overflow-hidden">
      {/* Arama Çubuğu */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Sohbet Ara..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Sohbet Listesi */}
      <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        <div className="space-y-3">
          {/* Sohbet Öğesi 1 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:bg-indigo-50 transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <Image
                src="/5.jpg"
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
              />
              <div>
                <p className="text-lg font-medium text-gray-800">Ahmet Yılmaz</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Merhaba!
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">2 dakika önce</span>
              <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                3
              </span>
            </div>
          </div>

          {/* Sohbet Öğesi 2 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:bg-indigo-50 transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <Image
                src="/5.jpg"
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
              />
              <div>
                <p className="text-lg font-medium text-gray-800">Ayşe Yılmaz</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Nasılsın?
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">5 dakika önce</span>
              <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                1
              </span>
            </div>
          </div>
  {/* Sohbet Öğesi 2 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:bg-indigo-50 transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <Image
                src="/5.jpg"
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
              />
              <div>
                <p className="text-lg font-medium text-gray-800">Ayşe Yılmaz</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Nasılsın?
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">5 dakika önce</span>
              <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                1
              </span>
            </div>
          </div>
            {/* Sohbet Öğesi 2 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:bg-indigo-50 transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <Image
                src="/5.jpg"
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
              />
              <div>
                <p className="text-lg font-medium text-gray-800">Ayşe Yılmaz</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Nasılsın?
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">5 dakika önce</span>
              <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                1
              </span>
            </div>
          </div>
            {/* Sohbet Öğesi 2 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:bg-indigo-50 transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <Image
                src="/5.jpg"
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
              />
              <div>
                <p className="text-lg font-medium text-gray-800">Ayşe Yılmaz</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Nasılsın?
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">5 dakika önce</span>
              <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                1
              </span>
            </div>
          </div>
            {/* Sohbet Öğesi 2 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:bg-indigo-50 transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <Image
                src="/5.jpg"
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
              />
              <div>
                <p className="text-lg font-medium text-gray-800">Ayşe Yılmaz</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Nasılsın?
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">5 dakika önce</span>
              <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                1
              </span>
            </div>
          </div>
            {/* Sohbet Öğesi 2 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:bg-indigo-50 transition cursor-pointer">
            <div className="flex items-center space-x-3">
              <Image
                src="/5.jpg"
                alt="Profile"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
              />
              <div>
                <p className="text-lg font-medium text-gray-800">Ayşe Yılmaz</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  Nasılsın?
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">5 dakika önce</span>
              <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                1
              </span>
            </div>
          </div>
          {/* Daha fazla sohbet öğesi eklenebilir */}
        </div>
      </div>
    </div>
  );
}
export default Main;
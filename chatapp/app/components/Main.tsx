"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

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
 <div className="p-8 max-w-md mx-auto bg-white rounded shadow">
   
    </div>
  );
}
export default Main;
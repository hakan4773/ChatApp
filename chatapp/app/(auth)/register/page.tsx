"use client";
import { ChatBubbleLeftIcon, LanguageIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { useState } from 'react'
import { useFormik } from "formik";
import { supabase } from "../../lib/supabaseClient";
import type { User } from '@supabase/supabase-js';
import * as yup from 'yup';
function page() {
const [user, setUser] = useState<User | null>(null);
const [isRegistered, setIsRegistered] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
});
const formik = useFormik({
  initialValues: formData,
  onSubmit: async (values) => {
    if(user?.email){
      alert("bu email zaten kayıtlı")
    }
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: "http://localhost:3000/email-verified",
        data: {
          name: values.name,
        },
      },
    });
 if (error) {
    if (error.message.includes("already registered")) {
      alert("Bu e-posta zaten kayıtlı. Lütfen giriş yapın.");
    } else {
      console.error("Sign-up error:", error.message);
      alert(error.message);
    }
    return;
  }

  if (data?.user?.identities?.length === 0) {
    // Kullanıcı zaten kayıtlı ama doğrulanmamış: e-posta tekrar gönderildi
    alert("Bu e-posta adresine daha önce kayıt olunmuş ama henüz doğrulanmamış. Yeni doğrulama e-postası gönderildi.");
  } else {
    alert("Kayıt başarılı! Lütfen e-postanı kontrol et ve hesabını doğrula.");
  }

  
  },
  validationSchema: yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  }),
});

  return (

    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-400 to-indigo-900 flex flex-col lg:flex-row items-center justify-center p-4">
<div className="w-full flex justify-between items-center px-4 lg:px-12 py-4 absolute top-0 left-0 right-0">
        <Link href="/register" className="flex items-center text-white text-3xl font-bold tracking-tight">
          <ChatBubbleLeftIcon className="h-8 w-8 mr-2" />
          CHATAPP
        </Link>
      </div>

        <div className="text-center lg:w-1/2 mt-16 lg:mt-0">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Register
            </h1>
            <p className="text-lg text-gray-100 mt-4 max-w-md mx-auto">
            Create an account to connect with friends and family through chat and fun games.
            </p>
            </div>
        <div className="lg:w-1/2 max-w-md w-full mt-8 lg:mt-0">
            <form className="bg-white rounded-2xl shadow-xl p-8" onSubmit={formik.handleSubmit}>
                       <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                        Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            name='name'
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Name"
                        />
                    </div>
                    {formik.touched.name && formik.errors.name && (
  <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
)}
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name='email'
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Email"
                        />
                    </div>
                    {formik.touched.email && formik.errors.email && (
    <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
)}
                </div>
                
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            name='password'
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Password"
                        />
                    </div>
                    {formik.touched.password && formik.errors.password && (
    <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
)}
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white rounded-lg py-3 hover:bg-indigo-700 transition"
                >
                    Register
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                        Log In
                    </Link>
                </p>
            </form>
        </div>
    </div>
    
)
}

export default page

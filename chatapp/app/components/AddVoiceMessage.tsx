"use client";

import React, { useState, useRef, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useUser } from "@/app/context/UserContext";
import { toast } from "react-toastify";
import { MicrophoneIcon, XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function AddVoiceMessage({ onSendAudio }: { onSendAudio?: (url: string) => void }) {
  const { user } = useUser();
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    if (!user?.id) {
      toast.error("Giriş yapmanız gerekiyor.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        chunks.current = [];
        if (blob.size > 5 * 1024 * 1024) {
          toast.error("Ses dosyası 5MB'dan büyük olamaz.");
          return;
        }
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };
      mediaRecorderRef.current.start();
      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error("Mikrofon erişimi reddedildi.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setRecording(false);
      setAudioURL(null);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const uploadAudio = async () => {
    if (!audioURL || !user?.id) return;
    try {
      const blob = await fetch(audioURL).then((res) => res.blob());
      const fileName = `audio_${Date.now()}.webm`;
      const { data, error } = await supabase.storage
        .from("voice-messages")
        .upload(`public/${user.id}/${fileName}`, blob, {
          contentType: "audio/webm",
        });

      if (error) throw new Error("Ses yüklenemedi: " + error.message);

      const { data: urlData } = supabase.storage
        .from("voice-messages")
        .getPublicUrl(`public/${user.id}/${fileName}`);

      if (onSendAudio && urlData.publicUrl) {
        onSendAudio(urlData.publicUrl);
      }
      toast.success("Sesli mesaj gönderildi.");
      setAudioURL(null);
    } catch (err) {
      toast.error("Sesli mesaj yüklenemedi.");
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center gap-2">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className={`p-3 rounded-full transition-colors ${
          recording
            ? "bg-red-500 animate-pulse"
            : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        } text-white`}
        aria-label={recording ? "Kaydı durdur" : "Ses kaydını başlat"}
      >
        <MicrophoneIcon className="w-5 h-5" />
      </button>

      {recording && (
        <div className="absolute bottom-14 left-0 w-full max-w-sm bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <MicrophoneIcon className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <button
            onClick={cancelRecording}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-500 transition-colors"
            aria-label="Kaydı iptal et"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}

      {audioURL && !recording && (
        <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
          <audio controls src={audioURL} className="w-full max-w-xs rounded-md" />
          <button
            onClick={uploadAudio}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 active:bg-blue-700 transition-colors"
            aria-label="Sesli mesaj gönder"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setAudioURL(null)}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 transition-colors"
            aria-label="Sesli mesajı iptal et"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
}
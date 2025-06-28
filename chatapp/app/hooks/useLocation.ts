"use client"
import {  useState } from "react";

type Location = {
    lat: number;
    lng: number;
} | null;

export const useLocation = () => {
    const [location, setLocation] = useState<Location>(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("Tarayıcınız konum bilgisini desteklemiyor");
            return;
        }
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        });
    };

    return { location, getLocation, setLocation };
}
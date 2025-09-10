"use client";
import { UserProvider, useUser } from "./context/UserContext";
import { ToastContainer } from 'react-toastify';
import  "./globals.css"
import { ThemeProvider } from "./context/ThemaContext";
import NotificationListener from "./components/NotificationListener";
import OnlineUpdater from "./components/OnlineUpdater";

function AppContent({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const currentUserId = user?.id || "";

  return (
    <>
      <NotificationListener currentUserId={currentUserId} />
      {children}
    </>
  );
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body>
       <ThemeProvider>    
         <UserProvider>
          <OnlineUpdater />
          <ToastContainer />
          <AppContent>
          {children} 
          </AppContent> 
          </UserProvider>
       </ThemeProvider>
      </body>
    </html>
  );
}
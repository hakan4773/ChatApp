import { UserProvider } from "./context/UserContext";
import { ToastContainer } from 'react-toastify';
import  "./globals.css"
import { ThemeProvider } from "./context/ThemaContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body>
       <ThemeProvider>    
        <UserProvider>
          <ToastContainer />
         {children} 
        </UserProvider>
       </ThemeProvider>
      </body>
    </html>
  );
}
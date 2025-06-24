import { UserProvider } from "./context/UserContext";
import { ToastContainer } from 'react-toastify';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ToastContainer />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
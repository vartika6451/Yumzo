import './globals.css';
import Cart from '../components/Cart';
import ClientToast from '../components/ClientToast';

export const metadata = {
  title: 'Yumzo - Full-Stack Food Delivery Platform',
  description: 'Discover and order delicious food near you with real-time tracking.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <ClientToast />
        <Cart />
        <main>{children}</main>
      </body>
    </html>
  );
}

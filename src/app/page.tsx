import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Let's Build Your MVP!</h2>
          <p className="text-gray-600">[Your form will go here later]</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
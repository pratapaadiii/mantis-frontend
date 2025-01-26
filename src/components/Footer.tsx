export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <p className="text-gray-400">Follow us on:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
          </div>
        </div>
        <p className="text-gray-500">© 2025 MANTIS. All rights reserved.</p>
      </div>
    </footer>
  );
}
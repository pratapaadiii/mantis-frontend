export default function Header() {
  return (
    <header className="bg-blue-700 shadow-md">
      <div className="container mx-auto p-6 flex justify-between items-center">
        <div>
          <h1 className="text-white text-3xl font-extrabold tracking-tight">MANTIS</h1>
          <p className="text-blue-200 text-lg">Build your MVP roadmap with confidence</p>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="text-white hover:text-blue-300">Home</a></li>
            <li><a href="#" className="text-white hover:text-blue-300">Features</a></li>
            <li><a href="#" className="text-white hover:text-blue-300">Pricing</a></li>
            <li><a href="#" className="text-white hover:text-blue-300">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
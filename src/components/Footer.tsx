export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <div className="text-sm text-gray-600">© 2025 Tsuuko</div>

          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/Tsuuko/kabunushi-passport-filter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <img src="/icons/github.svg" alt="GitHub" className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>

            <a
              href="https://x.com/_Tsuuko_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <img src="/icons/x.svg" alt="X" className="w-5 h-5" />
              <span className="text-sm">X</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
export function Footer() {
  return (
    <footer
      id="footer"
      className="py-6 w-full px-4  bg-primary text-white backdrop-blur-md border-t border-white/10 "
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Tantei</h3>
          <p className="text-sm text-gray-300 mb-4">
            Discover and follow cutting-edge AI trading agents built for the
            Hedera ecosystem
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/app/marketplace"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Marketplace
              </Link>
            </li>
            <li>
              <Link
                to="/app/portfolio"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Portfolio
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-sm text-gray-300">
            Need help? Reach out to us at antonymbeka@gmail.com
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/10">
        <p className="text-center text-sm text-gray-300">
          © {new Date().getFullYear()} Tantei. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

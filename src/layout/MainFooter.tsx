import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { PiThreadsLogo } from "react-icons/pi";

/**
 * Global footer with simple branding and social links.
 */
export default function MainFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-6 text-sm text-gray-900 md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} Holidaze</span>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-900">Follow Holidaze</span>
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Holidaze on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-gray-700 hover:bg-gray-100"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Holidaze on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-gray-700 hover:bg-gray-100"
            >
              <FaInstagram className="h-4 w-4" />
            </a>
            <a
              href="https://threads.net"
              target="_blank"
              rel="noreferrer"
              aria-label="Holidaze on Threads"
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-gray-700 hover:bg-gray-100"
            >
              <PiThreadsLogo className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
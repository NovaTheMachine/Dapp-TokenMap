import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Cadastral Token Map</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-blue-500">
              Home
            </a>
          </Link>
          <Link href="/create-land">
            <a className="mr-6 text-blue-500">
              Create a new land
            </a>
          </Link>
          <Link href="/my-lands">
            <a className="mr-6 text-blue-500">
              My Lands
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-blue-500">
              Creator Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
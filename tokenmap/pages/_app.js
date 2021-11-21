import '../styles/globals.css'
import Link from 'next/link'
import {useEffect, useRef} from 'react';




function MyApp({ Component, pageProps }) {
  return (
    <div  >
      <nav className="border-b p-6">

        <p className="text-4xl font-bold">Cadastral Token Map</p>
        <div class="flex mr-3" >

          <Link href="/create-land" >
            <a class="inline-block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-1 px-3">
              Create a new land
            </a>
          </Link>
          <Link href="/my-lands" class="mr-1" >
            <a class="inline-block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-1 px-3">
              My Lands
            </a>
          </Link>
          <Link href="/creator-dashboard" class="mr-1" >
            <a class="inline-block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-1 px-3">
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
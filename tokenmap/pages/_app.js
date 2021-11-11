import '../styles/globals.css'
import Link from 'next/link'
import {useEffect, useRef} from 'react';
import {Loader} from '@googlemaps/js-api-loader';function HomePage() {
  const googlemap = useRef(null);  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      version: 'weekly',
    });    let map; 
    loader.load().then(() => {
      const google = window.google;
      map = new google.maps.Map(googlemap.current, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8,
      });
    });
  });  return (
    <div id="map" ref={googlemap} />
  );
}

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
          <Link href="/test">
            <a className="mr-6 text-blue-500">
              test
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
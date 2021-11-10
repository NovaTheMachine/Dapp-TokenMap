import '../styles/globals.css'
import Link from 'next/link'
let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

function MyApp({ Component, pageProps }) {

  return (
    <div>

      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Cadastral Token Map</p>
        <div className="flex mt-4">
          <div id="map">

          </div>
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

      <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD2J9TyPQUKhwf4a63N4E0Mj3jn01laYsk&v=3&callback=init" async defer></script>
    </div>

  )
}

export default MyApp
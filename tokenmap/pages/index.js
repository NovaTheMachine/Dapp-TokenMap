/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '/home/toshiba/projects/Blockchain/HACKATHON/Dapp-TokenMap/tokenmap/artifacts/contracts/NFT.sol/NFT.json'
import Market from '/home/toshiba/projects/Blockchain/HACKATHON/Dapp-TokenMap/tokenmap/artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadLands()
  }, [])
  async function loadLands() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/d5b5a5f91fae4fd1b5f9eb66fc3e2295")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMyNFTs()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const lands = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let Land = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        CoordCenterLat: meta.data.CoordCenterLat,
        CoordCenterLng: meta.data.CoordCenterLng,
        CoordLat1: meta.data.CoordLat1,
        CoordLng1: meta.data.CoordLng1,
        CoordLng2: meta.data.CoordLng2,
        CoordLat2: meta.data.CoordLat2,
        CoordLng3: meta.data.CoordLng3,
        CoordLat3: meta.data.CoordLat3,
        CoordLng4: meta.data.CoordLng4,
        CoordLat4: meta.data.CoordLat4,
        CoordLat5: meta.data.CoordLat5,
        CoordLng5: meta.data.CoordLng5,
        CoordLng6: meta.data.CoordLng6,
        CoordLat6: meta.data.CoordLat6,
        CoordLng7: meta.data.CoordLng7,
        CoordLat7: meta.data.CoordLat7,
        CoordLng8: meta.data.CoordLng8,
        CoordLat8: meta.data.CoordLat8,
        CoordLng9: meta.data.CoordLng9,
        CoordLat9: meta.data.CoordLat9
      }
      return Land
    }))
    setNfts(lands)
    setLoadingState('loaded')
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
     
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No Lands in This place</h1>)
  return (
    <div >
      

      <div className="p-4">
        <div className="grid grid-cols-4 gap-4 pt">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                                <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${nft.CoordCenterLat},${nft.CoordCenterLng}
                                    &zoom=19&size=1600x1600&maptype=satellite&sensor=false&path=color:white|weight:4|fillcolor:red|
                                    ${nft.CoordLat1},${nft.CoordLng1}|${nft.CoordLat2},${nft.CoordLng2}|${nft.CoordLat3},${nft.CoordLng3}|${nft.CoordLat4},${nft.CoordLng4}|
                                    ${nft.CoordLat5},${nft.CoordLng5}|${nft.CoordLat6},${nft.CoordLng6}|${nft.CoordLat7},${nft.CoordLng7}|${nft.CoordLat8},${nft.CoordLng8}|${nft.CoordLat9},${nft.CoordLng9}&key=AIzaSyCJtJkKb1xi8b64N1AdgG3ZAqX5n466pf4 `} className="rounded flex-auto" />
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '2%' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '3%', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
      <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button> 
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
/* pages/creator-dashboard.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
    nftmarketaddress, nftaddress
} from '../config'




import NFT from '/home/toshiba/projects/Blockchain/HACKATHON/Dapp-TokenMap/tokenmap/artifacts/contracts/NFT.sol/NFT.json'
import Market from '/home/toshiba/projects/Blockchain/HACKATHON/Dapp-TokenMap/tokenmap/artifacts/contracts/NFTMarket.sol/NFTMarket.json'


export default function CreatorDashboard() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {

        const web3Modal = new Web3Modal({
            network: "rinkeby",
            cacheProvider: true,
        })


        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()


        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchItemsCreated()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                name: meta.data.name,
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
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
                CoordLat9: meta.data.CoordLat9,
                
            }

            return item
        }))
        /* create a filtered array of items that have been sold */
        const soldItems = items.filter(i => i.sold)
        setSold(soldItems)
        setNfts(items)
        setLoadingState('loaded')
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
    return (
        <html>
            <head>

            </head>

            <div>
                <div className="p-4">
                    <h2 className="text-2xl py-2">Items Created</h2>
                    <div className="grid grid-cols-4 gap-4 pt">
                        {
                            nfts.map((nft, i) => (


                                <div key={i} className="border shadow rounded-xl overflow-hidden" >
                                    <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${nft.CoordCenterLat},${nft.CoordCenterLng}
                                    &size=1600x1600&maptype=satellite&sensor=false&path=color:white|weight:4|fillcolor:red|
                                    ${nft.CoordLat1},${nft.CoordLng1}|${nft.CoordLat2},${nft.CoordLng2}|${nft.CoordLat3},${nft.CoordLng3}|${nft.CoordLat4},${nft.CoordLng4}|
                                    ${nft.CoordLat5},${nft.CoordLng5}|${nft.CoordLat6},${nft.CoordLng6}|${nft.CoordLat7},${nft.CoordLng7}|${nft.CoordLat8},${nft.CoordLng8}|${nft.CoordLat9},${nft.CoordLng9}&key=AIzaSyCJtJkKb1xi8b64N1AdgG3ZAqX5n466pf4 `} className="rounded flex-auto" />
                                    <img src={nft.image} />
                                    <div className="p-4 bg-black">
                                        <p className="text-2xl font-bold text-white">Name - {nft.name}</p>
                                        <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                        <p className="text-2xl font-bold text-white">Description - {nft.description}</p>
                                        <p className="text-2xl font-bold text-white">API Name - {nft.apiName}</p>

                                    </div>
                                </div>

                            ))
                        }
                    </div>

                </div>
                <div className="px-4">
                    {
                        Boolean(sold.length) && (
                            <div>
                                <h2 className="text-2xl py-2">Items sold</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                    {
                                        sold.map((nft, i) => (
                                            <div key={i} className="border shadow rounded-xl overflow-hidden">
                                                <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${nft.CoordCenter},${nft.CoordCenter}&zoom=5&size=600x600&maptype=satellite&sensor=false&path=color:red|weight:1|fillcolor:white|33.4022475,-111.9426775|33.4022475,-111.9427525|33.4023225,-111.9427525|33.4023225,-111.9426775|33.4022475,-111.9426775&key=AIzaSyCJtJkKb1xi8b64N1AdgG3ZAqX5n466pf4 `} className="rounded" />
                                                <img src={nft.image} />
                                                <div className="p-4 bg-black">
                                                    <p className="text-2xl font-bold text-white">Price -  Eth</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </html>
    )
}
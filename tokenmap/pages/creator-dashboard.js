/* pages/creator-dashboard.js */
import { ethers } from 'ethers'
import { useEffect, useState,useRef } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { Loader } from "@googlemaps/js-api-loader"

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
            network: "mainnet",
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
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                sold: i.sold,
                image: meta.data.image,
                CoordCenter: meta.data.CoordCenter,
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
                <div className="grid grid-cols-3 gap-4 pt">
                    {
                        nfts.map((nft, i) => (
                                                     

                            <div key={i} className="border shadow rounded-xl overflow-hidden" >
                            <img src= {`https://maps.googleapis.com/maps/api/staticmap?center=${nft.CoordCenter},${nft.CoordCenter}&zoom=5&size=600x600&maptype=satellite&sensor=false&path=color:red|weight:1|fillcolor:white|33.4022475,-111.9426775|33.4022475,-111.9427525|33.4023225,-111.9427525|33.4023225,-111.9426775|33.4022475,-111.9426775&key=AIzaSyCJtJkKb1xi8b64N1AdgG3ZAqX5n466pf4 `}className="rounded" />
                                <div className="p-4 bg-black">
                                    <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                    <p className="text-2xl font-bold text-white">Coords - {nft.CoordCenter}</p>
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
                                            <img src= "https://maps.googleapis.com/maps/api/staticmap?center=33.402285,-111.942715&zoom=19&size=600x600&maptype=satellite&sensor=false&path=color:red|weight:1|fillcolor:white|33.4022475,-111.9426775|33.4022475,-111.9427525|33.4023225,-111.9427525|33.4023225,-111.9426775|33.4022475,-111.9426775&key=AIzaSyCJtJkKb1xi8b64N1AdgG3ZAqX5n466pf4" className="rounded" />
                                            <div className="p-4 bg-black">
                                                <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
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
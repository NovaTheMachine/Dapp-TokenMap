/* pages/create-item.js */
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


import {
    nftaddress, nftmarketaddress
} from '../config'

import NFT from '/home/toshiba/projects/Blockchain/HACKATHON/Dapp-TokenMap/tokenmap/artifacts/contracts/NFT.sol/NFT.json'
import Market from '/home/toshiba/projects/Blockchain/HACKATHON/Dapp-TokenMap/tokenmap/artifacts/contracts/NFTMarket.sol/NFTMarket.json'


export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({
        price: '', name: '', description: '', CoordCenterLng: '', CoordCenterLat: '',
        CoordLng1: '', CoordLat1: '', CoordLng2: '', CoordLat2: '', CoordLng3: '', CoordLat3: '', CoordLng4: '', CoordLat4: '',
        CoordLng5: '', CoordLat5: '', CoordLng6: '', CoordLat6: '', CoordLng7: '', CoordLat7: '', CoordLng8: '', CoordLat8: '', CoordLng9: '', CoordLat9: ''
    })
    const router = useRouter()

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }
    async function createMarket() {
        const { name, description, price, CoordCenterLat, CoordCenterLng, CoordLng1, CoordLat1, CoordLng2, CoordLat2, CoordLng3, CoordLat3, CoordLng4, CoordLat4, CoordLng5, CoordLat5, CoordLng6, CoordLat6, CoordLng7, CoordLat7, CoordLng8, CoordLat8, CoordLng9, CoordLat9 } = formInput
        if (!name || !description || !fileUrl) return
        /* first, upload to IPFS */
        const data = JSON.stringify({
            name, description, image: fileUrl, CoordCenterLat, CoordCenterLng, CoordLng1, CoordLat1, CoordLng2, CoordLat2, CoordLng3,
            CoordLat3, CoordLng4, CoordLat4, CoordLng5, CoordLat5, CoordLng6, CoordLat6, CoordLng7, CoordLat7, CoordLng8, CoordLat8, CoordLng9, CoordLat9
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
            createSale(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createSale(url) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        const price = ethers.utils.parseEther(formInput.price, 'ether')
        const CoordCenterLat = formInput.CoordCenterLat
        const CoordCenterLng = formInput.CoordCenterLng
        const CoordLng1 = formInput.CoordLng1
        const CoordLng2 = formInput.CoordLng2
        const CoordLng3 = formInput.CoordLng3
        const CoordLng4 = formInput.CoordLng4
        const CoordLat1 = formInput.CoordLat1
        const CoordLat2 = formInput.CoordLat2
        const CoordLat3 = formInput.CoordLat3
        const CoordLat4 = formInput.CoordLat4
        const CoordLng5 = formInput.CoordLng5
        const CoordLng6 = formInput.CoordLng9
        const CoordLng7 = formInput.CoordLng7
        const CoordLng8 = formInput.CoordLng8
        const CoordLng9 = formInput.CoordLng9
        const CoordLat5 = formInput.CoordLat5
        const CoordLat6 = formInput.CoordLat6
        const CoordLat7 = formInput.CoordLat7
        const CoordLat8 = formInput.CoordLat8
        const CoordLat9 = formInput.CoordLat9


        /* then list the item for sale on the marketplace */
        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()



        transaction = await contract.createMarketItem(nftaddress, tokenId, price)
        await transaction.wait()
        router.push('/')
    }

    return (

        <div className="flex justify-evenly">
            <div className="w-1/2 flex flex-col ">
                <input
                    placeholder="Name"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input
                    placeholder="Asset Price in Eth"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />

                <div class="grid grid-cols-2 gap-2">
                    <input
                        placeholder="Center Coordinate lat"
                        className="mt-2 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordCenterLat: e.target.value })}
                    />
                    <input
                        placeholder="Center Coordinate long"
                        className="mt-2 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordCenterLng: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates lat 1"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLat1: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates Long 1 "
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLng1: e.target.value })}
                    />

                    <input
                        placeholder="Coordinates lat 2"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLat2: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates Long 2"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLng2: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates lat 3"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLat3: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates Long 3"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLng3: e.target.value })}
                    />

                    <input
                        placeholder="Coordinates lat 4 "
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLat4: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates Long 4"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLng4: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates lat 5"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLat5: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates Long 5 "
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLng5: e.target.value })}
                    />

                    <input
                        placeholder="Coordinates lat 6"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLat6: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates Long 6"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLng6: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates lat 7"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLat7: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates Long 7"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLng7: e.target.value })}
                    />

                    <input
                        placeholder="Coordinates lat 8 "
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLat8: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates Long 8"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLng8: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates lat 9 "
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLat9: e.target.value })}
                    />
                    <input
                        placeholder="Coordinates Long 9"
                        className="mt-1 border rounded p-4"
                        onChange={e => updateFormInput({ ...formInput, CoordLng9: e.target.value })}
                    />
                </div>

                <input
                    type="file"
                    name="Asset"
                    className="my-4"
                    onChange={onChange}
                />
                {
                    fileUrl && (
                        <img className="rounded mt-4" width="350" src={fileUrl} />
                    )
                }
                <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Create New Land
                </button>
            </div>
        </div>
    )
}

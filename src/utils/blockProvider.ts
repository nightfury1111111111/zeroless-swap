import { ethers } from 'ethers'
import masterchefABI from 'config/abi/masterchef.json'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { getProvider } from 'utils/providers'

export const getSphynxPerBlock: any = async (chainId) => {
    const masterChefAddress = getMasterChefAddress(chainId)
    const provider = getProvider(chainId)

    const masterChef = new ethers.Contract(masterChefAddress, masterchefABI, provider)
    const sphynxPerBlock = (await masterChef.sphynxPerBlock()) / (10 ** 18)
    return sphynxPerBlock
}

import { Farm } from 'state/types'
import { ChainId } from '@sphynxdex/sdk-multichain'
import fetchPublicFarmData from './fetchPublicFarmData'

const fetchFarm = async (farm: Farm, chainId: ChainId): Promise<Farm> => {
  const farmPublicData = await fetchPublicFarmData(farm, chainId)

  return { ...farm, ...farmPublicData }
}

export default fetchFarm

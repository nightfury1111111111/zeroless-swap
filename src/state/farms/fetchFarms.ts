import { FarmConfig } from 'config/constants/types'
import { ChainId } from '@sphynxdex/sdk-multichain'
import fetchFarm from './fetchFarm'

const fetchFarms = async (farmsToFetch: FarmConfig[], chainId: ChainId) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig, chainId)
      return farm
    }),
  )
  .then((res) => {
    return res
  })
  .catch(error => {
    return undefined
  });
  return data
}

export default fetchFarms

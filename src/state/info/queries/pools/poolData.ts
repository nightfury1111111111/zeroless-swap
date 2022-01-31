/* eslint-disable no-param-reassign */
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { PoolData } from 'state/info/types'

interface PoolFields {
  id: string
  reserve0: string
  reserve1: string
  reserveUSD: string
  volumeUSD: string
  token0Price: string
  token1Price: string
  token0: {
    id: string
    symbol: string
    name: string
  }
  token1: {
    id: string
    symbol: string
    name: string
  }
}

interface FormattedPoolFields
  extends Omit<PoolFields, 'volumeUSD' | 'reserveUSD' | 'reserve0' | 'reserve1' | 'token0Price' | 'token1Price'> {
  volumeUSD: number
  reserveUSD: number
  reserve0: number
  reserve1: number
  token0Price: number
  token1Price: number
}

interface PoolsQueryResponse {
  now: PoolFields[]
  oneDayAgo: PoolFields[]
  twoDaysAgo: PoolFields[]
  oneWeekAgo: PoolFields[]
  twoWeeksAgo: PoolFields[]
}

const POOL_AT_BLOCK = (block: number | null, pools: string[]) => {
  const blockString = block ? `block: {number: ${block}}` : ``
  const addressesString = `["${pools.join('","')}"]`
  return `pairs(
    where: { id_in: ${addressesString} }
    ${blockString}
    orderBy: trackedReserveBNB
    orderDirection: desc
  ) {
    id
    reserve0
    reserve1
    reserveUSD
    volumeUSD
    token0Price
    token1Price
    token0 {
      id
      symbol
      name
    }
    token1 {
      id
      symbol
      name
    }
  }`
}

const parsePoolData = (pairs?: PoolFields[]) => {
  if (!pairs) {
    return {}
  }
  return pairs.reduce((accum: { [address: string]: FormattedPoolFields }, poolData) => {
    const { volumeUSD, reserveUSD, reserve0, reserve1, token0Price, token1Price } = poolData
    accum[poolData.id] = {
      ...poolData,
      volumeUSD: parseFloat(volumeUSD),
      reserveUSD: parseFloat(reserveUSD),
      reserve0: parseFloat(reserve0),
      reserve1: parseFloat(reserve1),
      token0Price: parseFloat(token0Price),
      token1Price: parseFloat(token1Price),
    }
    return accum
  }, {})
}

export const fetchPoolData = async (
  poolAddresses: string[],
): Promise<{
  error: boolean
  poolDatas?: PoolData[]
}> => {
  try {
    const query = gql`
      query pools {
        now: ${POOL_AT_BLOCK(null, poolAddresses)}
      }
    `
    const data = await request<PoolsQueryResponse>(INFO_CLIENT, query)
    if (data) {
      const formattedPoolData = parsePoolData(data?.now)

      const formatted: PoolData[] = []
      poolAddresses.forEach((address) => {
        const current: FormattedPoolFields | undefined = formattedPoolData[address]
        formatted.push({
          address,
          token0: {
            address: current.token0.id,
            name: current.token0.name,
            symbol: current.token0.symbol,
          },
          token1: {
            address: current.token1.id,
            name: current.token1.name,
            symbol: current.token1.symbol,
          },
          token0Price: current.token0Price,
          token1Price: current.token1Price,
          volumeUSD: current.volumeUSD,
          liquidityUSD: current.reserveUSD,
          liquidityToken0: current.reserve0,
          liquidityToken1: current.reserve1,
        })
      })

      return { poolDatas: formatted, error: false }
    }

    return { error: true }
  } catch (error) {
    console.error('Failed to fetch pool data', error)
    return { error: true }
  }
}

export default fetchPoolData

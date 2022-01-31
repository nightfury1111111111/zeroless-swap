import BigNumber from 'bignumber.js'
import masterchefABI from 'config/abi/masterchef.json'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { getSphynxPerBlock } from 'utils/blockProvider'

const fetchTokenPerBlock = async (pid: number, chainId: number) => {
  const masterChefAddress = getMasterChefAddress(chainId)

  // Only make masterchef calls if farm has pid
  const [info, totalAllocPoint] =
    pid || pid === 0
      ? await multicall(masterchefABI, [
          {
            address: masterChefAddress,
            name: 'poolInfo',
            params: [pid],
          },
          {
            address: masterChefAddress,
            name: 'totalAllocPoint',
          },
        ],
        chainId)
      : [null, null]

  const sphynxPerBlock = await getSphynxPerBlock(chainId)

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO
  return sphynxPerBlock * poolWeight.toNumber()
}

export default fetchTokenPerBlock

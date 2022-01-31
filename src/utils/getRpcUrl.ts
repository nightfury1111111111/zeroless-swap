import sample from 'lodash/sample'
import chainIds from 'config/constants/chainIds'

// Array of available nodes to connect to
export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]
const allNodes = JSON.parse(process.env.REACT_APP_NODES)

const getNodeUrl = (chainId = chainIds.BNB_CHAIN_ID) => {
  return sample(allNodes[chainId])
}

export default getNodeUrl

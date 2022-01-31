import { Interface } from '@ethersproject/abi'
import FAIRLAUNCH_ABI from './fairLaunchAbi.json'

const FAIRLAUNCH_INTERFACE = new Interface(FAIRLAUNCH_ABI)

export default FAIRLAUNCH_INTERFACE
export { FAIRLAUNCH_ABI }
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import Web3 from 'web3'
import tokenABI from 'assets/abis/erc20.json'

const getTokenInfo = (address: any) => {
  return new Promise((resolve, reject) => {
    const providerURL = 'https://bsc-dataseed.binance.org/'
    const web3 = new Web3(new Web3.providers.HttpProvider(providerURL))
    const abi: any = tokenABI
    const tokenContract = new web3.eth.Contract(abi, address)
    tokenContract.methods
      .symbol()
      .call()
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log('error', err)
        reject(err)
      })
  })
}

export default getTokenInfo

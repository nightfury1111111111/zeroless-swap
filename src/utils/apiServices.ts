import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { ethers } from 'ethers'
import axios from 'axios'
import { PANCAKE_FACTORY_ADDRESS, SPHYNX_FACTORY_ADDRESS, UNISWAP_FACTORY_ADDRESS, SPHYNX_ETH_FACTORY_ADDRESS, ChainId } from '@sphynxdex/sdk-multichain'
import { WBNB_ADDRESS, WETH_ADDRESS, BUSD_ADDRESS, PANCAKE_V2_ROUTER, DAI_ADDRESS } from 'config/constants/addresses'
import abi from '../config/abi/erc20ABI.json'
import factoryAbi from '../config/abi/factoryAbi.json'
import { BITQUERY_API_KEY } from '../config/constants/endpoints'
import { web3Provider, ethWeb3Provider } from './providers'
import { getBNBPrice, getETHPrice, getTokenPrice, getTokenPriceETH } from './priceProvider'

const web3 = new Web3(web3Provider)
const web3ETH = new Web3(ethWeb3Provider)

const config = {
  headers: {
    'X-API-KEY': BITQUERY_API_KEY,
  },
}

async function getTokenDetails(
  address: string,
  routerVersion: string,
  chainId = 56
) {
  if (!address) {
    return null
  }
  const tokenContract = chainId === ChainId.MAINNET ?  new web3.eth.Contract(abi as AbiItem[], address) : new web3ETH.eth.Contract(abi as AbiItem[], address)
  const name = await tokenContract.methods.name().call()
  const symbol = await tokenContract.methods.symbol().call()
  const nativeCurrentySymbol = chainId === ChainId.MAINNET ? 'BNB' : 'ETH'
  return { name, symbol, pair: `${symbol}/${nativeCurrentySymbol}`, version: routerVersion }
}

async function getTokenInfoForChart(input: any, quoteAddress: any, pair: any, routerVersion: any, chainId = 56) {
  let query
  const minutes = 5
  const network = chainId === 56 ? 'bsc' : 'ethereum'
  const exchangeName = chainId === 56 ? `Pancake ${routerVersion}` : 'Uniswap'
  if (routerVersion === 'sphynx') {
    query = `{
        ethereum(network: ${network}) {
          dexTrades(
            options: {limit: 1, desc: "timeInterval.minute"}
            smartContractAddress: {is: "${pair}"}
            protocol: {is: "Uniswap v2"}
            baseCurrency: {is: "${input}"}
            quoteCurrency: {is: "${quoteAddress}"}
          ) {
            timeInterval {
              minute(count: ${minutes})
            }
            baseCurrency {
              symbol
              name
              address
            }
            open_price: minimum(of: time, get: quote_price)
          }
        }
      }
      `
  } else {
    query = `{
      ethereum(network: ${network}) {
        dexTrades(
          options: {limit: 1, desc: "timeInterval.minute"}
          protocol: {is: "Uniswap v2"}
          exchangeName: {is: "${exchangeName}"}
          baseCurrency: {is: "${input}"}
          quoteCurrency: {is: "${quoteAddress}"}
        ) {
          timeInterval {
            minute(count: ${minutes})
          }
          baseCurrency {
            symbol
            name
            address
          }
          open_price: minimum(of: time, get: quote_price)
        }
      }
    }
    `
  }

  const url = `https://graphql.bitquery.io/`
  const {
    data: {
      data: {
        ethereum: { dexTrades },
      },
    },
  } = await axios.post(url, { query }, config)

  const quoteTokenPrice = chainId === ChainId.MAINNET ? await getTokenPrice(quoteAddress) : await getTokenPriceETH(quoteAddress)

  return new Promise((resolve, reject) => {
    try {
      const price = dexTrades[0].open_price * quoteTokenPrice
      if (price > 1) {
        resolve({
          priceScale: 100,
          symbol: dexTrades[0].baseCurrency.symbol,
          name: dexTrades[0].baseCurrency.name,
        })
      } else {
        let scale = 1
        let tempPrice = price
        for (; ;) {
          scale *= 10
          tempPrice *= 10
          if (tempPrice > 100) {
            break
          }
        }
        resolve({
          priceScale: scale,
          symbol: dexTrades[0].baseCurrency.symbol,
          name: dexTrades[0].baseCurrency.name,
        })
      }
    } catch (error) {
      getTokenDetails(input, routerVersion, chainId)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}

async function getChartData(input: any, quoteAddress: any, pair: any, resolution: any, routerVersion: any, chainId = 56) {
  const resolutionMap = {
    1: 1,
    5: 5,
    10: 10,
    15: 15,
    30: 30,
    60: 60,
    '1H': 60,
    '1D': 1440,
    '1W': 1440 * 7,
    '1M': 1440 * 30,
  }
  const minutes = resolutionMap[resolution]
  const network = chainId === 56 ? 'bsc' : 'ethereum'
  const exchangeName = chainId === 56 ? `Pancake ${routerVersion}` : 'Uniswap'
  let query
  if (routerVersion === 'sphynx') {
    query = `{
        ethereum(network: ${network}) {
          dexTrades(
            options: {limit: 320, desc: "timeInterval.minute"}
            smartContractAddress: {is: "${pair}"}
            protocol: {is: "Uniswap v2"}
            baseCurrency: {is: "${input}"}
            quoteCurrency: {is: "${quoteAddress}"}
          ) {
            exchange {
              name
            }
            timeInterval {
              minute(count: ${minutes})
            }
            baseCurrency {
              symbol
              address
            }
            baseAmount
            quoteCurrency {
              symbol
              address
            }
            quoteAmount
            trades: count
            maximum_price: quotePrice(calculate: maximum)
            minimum_price: quotePrice(calculate: minimum)
            open_price: minimum(of: time, get: quote_price)
            close_price: maximum(of: time, get: quote_price)
            tradeAmount(in: USD, calculate: sum)
          }
        }
      }
      `
  } else {
    query = `{
      ethereum(network: ${network}) {
        dexTrades(
          options: {limit: 320, desc: "timeInterval.minute"}
          protocol: {is: "Uniswap v2"}
          exchangeName: {is: "${exchangeName}"}
          baseCurrency: {is: "${input}"}
          quoteCurrency: {is: "${quoteAddress}"}
        ) {
          exchange {
            name
          }
          timeInterval {
            minute(count: ${minutes})
          }
          baseCurrency {
            symbol
            address
          }
          baseAmount
          quoteCurrency {
            symbol
            address
          }
          quoteAmount
          trades: count
          maximum_price: quotePrice(calculate: maximum)
          minimum_price: quotePrice(calculate: minimum)
          open_price: minimum(of: time, get: quote_price)
          close_price: maximum(of: time, get: quote_price)
          tradeAmount(in: USD, calculate: sum)
        }
      }
    }
    `
  }

  const url = `https://graphql.bitquery.io/`
  let {
    data: {
      data: {
        ethereum: { dexTrades },
      },
    },
  } = await axios.post(url, { query }, config)

  dexTrades = dexTrades.reverse()

  const quoteTokenPrice = chainId === ChainId.ETHEREUM ? await getTokenPriceETH(quoteAddress) : await getTokenPrice(quoteAddress)

  return new Promise((resolve, reject) => {
    try {
      const data = dexTrades.map((trade) => {
        const dateTest = trade.timeInterval.minute
        const year = dateTest.slice(0, 4)
        const month = dateTest.slice(5, 7)
        const day = dateTest.slice(8, 10)
        const hour = dateTest.slice(11, 13)
        const minute = dateTest.slice(14, 16)
        const date = new Date(`${month}/${day}/${year} ${hour}:${minute}:00 UTC`)
        return {
          open: trade.open_price * quoteTokenPrice,
          close: trade.close_price * quoteTokenPrice,
          low: trade.minimum_price * quoteTokenPrice,
          high: trade.maximum_price * quoteTokenPrice,
          volume: trade.tradeAmount,
          time: date.getTime(),
        }
      })
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

async function getChartStats(address: string, routerVersion: string, chainId = 56, pairAddress, quoteTokenAddress) {
  if (chainId === 1) {
    const quoteContract = new web3ETH.eth.Contract(abi as AbiItem[], quoteTokenAddress)
    try {
      if (!address) {
        return {
          error: true,
          message: 'Invalid address!',
        }
      }
      const till = new Date().toISOString()
      const since = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()

      const baseAddress = address
      const quoteAddress = quoteTokenAddress
      let query =
        routerVersion === 'sphynx'
          ? `{
        ethereum(network: ethereum) {
          dexTrades(
            date: {since: "${since}", till: "${till}"}
            smartContractAddress: {is: "${pairAddress}"}
            baseCurrency: {is: "${baseAddress}"}
            quoteCurrency: {is: "${quoteAddress}"}
          ) {
            baseCurrency {
              symbol
            }
            quoteCurrency {
              symbol
            }
            open_price: minimum(of: block, get: quote_price)
            close_price: maximum(of: block, get: quote_price)
            tradeAmount(in: USD, calculate: sum)
          }
        }
      }
      `
          : `{
                ethereum(network: ethereum) {
                  dexTrades(
                    date: {since: "${since}", till: "${till}"}
                    baseCurrency: {is: "${baseAddress}"}
                    quoteCurrency: {is: "${quoteAddress}"}
                    exchangeName: {in: ["Uniswap"]}
                  ) {
                    baseCurrency {
                      symbol
                    }
                    quoteCurrency {
                      symbol
                    }
                    open_price: minimum(of: block, get: quote_price)
                    close_price: maximum(of: block, get: quote_price)
                    tradeAmount(in: USD, calculate: sum)
                  }
                }
              }
              `
      const url = `https://graphql.bitquery.io/`
      const {
        data: {
          data: {
            ethereum: { dexTrades },
          },
        },
      } = await axios.post(url, { query }, config)

      if (!dexTrades) {
        return {
          error: true,
          message: 'Invalid dexTrades!',
        }
      }

      const baseContract = new web3ETH.eth.Contract(abi as AbiItem[], baseAddress)

      let baseBalance = await baseContract.methods.balanceOf(pairAddress).call()
      const baseDecimals = await baseContract.methods.decimals().call()

      let quoteBalance = await quoteContract.methods.balanceOf(pairAddress).call()
      const quoteDecimals = await quoteContract.methods.decimals().call()

      baseBalance /= 10 ** baseDecimals
      quoteBalance /= 10 ** quoteDecimals

      let price
      let liquidityV2
      let liquidityV2BNB
      if (baseAddress !== WETH_ADDRESS) {
        query = `{
                  ethereum(network: ethereum) {
                    dexTrades(
                      date: {since: "${since}", till: "${till}"}
                      baseCurrency: {is: "${quoteTokenAddress}"}
                      quoteCurrency: {is: "${DAI_ADDRESS}"}
                      exchangeName: {in: ["Uniswap"]}
                    ) {
                      baseCurrency {
                        symbol
                      }
                      quoteCurrency {
                        symbol
                      }
                      close_price: maximum(of: block, get: quote_price)
                    }
                  }
                }
              `
        const {
          data: {
            data: {
              ethereum: { dexTrades: newDexTrades },
            },
          },
        } = await axios.post(url, { query }, config)
        if (!newDexTrades) {
          return {
            error: true,
            message: 'No data found of this address',
          }
        }
        price = parseFloat(dexTrades[0].close_price) * parseFloat(newDexTrades[0].close_price)
        liquidityV2 = quoteBalance * parseFloat(newDexTrades[0].close_price)
        liquidityV2BNB = quoteBalance
        if (price.toString().includes('e')) {
          price = price.toFixed(12)
        }
      } else {
        price = dexTrades[0].close_price
        liquidityV2 = baseBalance * price
        liquidityV2BNB = baseBalance
      }
      const percDiff =
        100 *
        Math.abs(
          (parseFloat(dexTrades[0].open_price) - parseFloat(dexTrades[0].close_price)) /
            ((parseFloat(dexTrades[0].open_price) + parseFloat(dexTrades[0].close_price)) / 2),
        )
      const sign = parseFloat(dexTrades[0].open_price) > parseFloat(dexTrades[0].close_price) ? '-' : '+'

      return {
        volume: dexTrades[0].tradeAmount,
        change: sign + percDiff,
        price,
        liquidityV2,
        liquidityV2BNB,
      }
    } catch (error) {
      console.log('error', error)
      const quotePrice = await getTokenPriceETH(quoteTokenAddress)
      let liquidityV2BNB = await quoteContract.methods.balanceOf(pairAddress).call()
      const quoteDecimals = await quoteContract.methods.decimals().call()
      liquidityV2BNB = ethers.utils.formatUnits(liquidityV2BNB, quoteDecimals)
      return {
        volume: '',
        change: '',
        price: '',
        liquidityV2: quotePrice * liquidityV2BNB,
        liquidityV2BNB,
      }
    }
  }
  const quoteContract = new web3.eth.Contract(abi as AbiItem[], quoteTokenAddress)
  try {
    if (!address) {
      return {
        error: true,
        message: 'Invalid address!',
      }
    }
    const till = new Date().toISOString()
    const since = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()

    const baseAddress = address
    const quoteAddress = quoteTokenAddress
    let query =
      routerVersion === 'sphynx'
        ? `{
      ethereum(network: bsc) {
        dexTrades(
          date: {since: "${since}", till: "${till}"}
          smartContractAddress: {is: "${pairAddress}"}
          baseCurrency: {is: "${baseAddress}"}
          quoteCurrency: {is: "${quoteAddress}"}
        ) {
          baseCurrency {
            symbol
          }
          quoteCurrency {
            symbol
          }
          open_price: minimum(of: block, get: quote_price)
          close_price: maximum(of: block, get: quote_price)
          tradeAmount(in: USD, calculate: sum)
        }
      }
    }
    `
        : `{
              ethereum(network: bsc) {
                dexTrades(
                  date: {since: "${since}", till: "${till}"}
                  baseCurrency: {is: "${baseAddress}"}
                  quoteCurrency: {is: "${quoteAddress}"}
                  exchangeName: {in: ["Pancake v2"]}
                ) {
                  baseCurrency {
                    symbol
                  }
                  quoteCurrency {
                    symbol
                  }
                  open_price: minimum(of: block, get: quote_price)
                  close_price: maximum(of: block, get: quote_price)
                  tradeAmount(in: USD, calculate: sum)
                }
              }
            }
            `
    const url = `https://graphql.bitquery.io/`
    const {
      data: {
        data: {
          ethereum: { dexTrades },
        },
      },
    } = await axios.post(url, { query }, config)

    if (!dexTrades) {
      return {
        error: true,
        message: 'Invalid dexTrades!',
      }
    }

    const baseContract = new web3.eth.Contract(abi as AbiItem[], baseAddress)

    let baseBalance = await baseContract.methods.balanceOf(pairAddress).call()
    const baseDecimals = await baseContract.methods.decimals().call()

    let quoteBalance = await quoteContract.methods.balanceOf(pairAddress).call()
    const quoteDecimals = await quoteContract.methods.decimals().call()

    baseBalance /= 10 ** baseDecimals
    quoteBalance /= 10 ** quoteDecimals

    let price = await getTokenPrice(quoteTokenAddress)
    let liquidityV2
    let liquidityV2BNB
    if (baseAddress !== WBNB_ADDRESS) {
      query = `{
                ethereum(network: bsc) {
                  dexTrades(
                    date: {since: "${since}", till: "${till}"}
                    baseCurrency: {is: "${quoteTokenAddress}"}
                    quoteCurrency: {is: "${BUSD_ADDRESS}"}
                    exchangeName: {in: ["Pancake v2"]}
                  ) {
                    baseCurrency {
                      symbol
                    }
                    quoteCurrency {
                      symbol
                    }
                    close_price: maximum(of: block, get: quote_price)
                  }
                }
              }
            `
      const {
        data: {
          data: {
            ethereum: { dexTrades: newDexTrades },
          },
        },
      } = await axios.post(url, { query }, config)
      if (!newDexTrades) {
        return {
          error: true,
          message: 'No data found of this address',
        }
      }
      price = parseFloat(dexTrades[0].close_price) * parseFloat(newDexTrades[0].close_price)
      liquidityV2 = quoteBalance * parseFloat(newDexTrades[0].close_price)
      liquidityV2BNB = quoteBalance
      if (price.toString().includes('e')) {
        price = price.toFixed(12)
      }
    } else {
      price = dexTrades[0].close_price
      liquidityV2 = baseBalance * price
      liquidityV2BNB = baseBalance
    }
    const percDiff =
      100 *
      Math.abs(
        (parseFloat(dexTrades[0].open_price) - parseFloat(dexTrades[0].close_price)) /
        ((parseFloat(dexTrades[0].open_price) + parseFloat(dexTrades[0].close_price)) / 2),
      )
    const sign = parseFloat(dexTrades[0].open_price) > parseFloat(dexTrades[0].close_price) ? '-' : '+'

    return {
      volume: dexTrades[0].tradeAmount,
      change: sign + percDiff,
      price,
      liquidityV2,
      liquidityV2BNB,
    }
  } catch (error) {
    console.log("error", error)
    const tokenPrice = await getTokenPrice(quoteTokenAddress)
    console.log("TokenPrice", tokenPrice)
    let liquidityV2BNB = await quoteContract.methods.balanceOf(pairAddress).call()
    const quoteDecimals = await quoteContract.methods.decimals().call()
    liquidityV2BNB = ethers.utils.formatUnits(liquidityV2BNB, quoteDecimals)
    return {
      volume: '',
      change: '',
      price: '',
      liquidityV2: liquidityV2BNB * tokenPrice,
      liquidityV2BNB,
    }
  }
}

async function socialToken(address: string) {
  try {
    const url = `https://r.poocoin.app/smartchain/assets/${address}/info.json`
    const { data } = await axios.get(url)
    delete data.links
    return data
  } catch (e) {
    return { msg: 'error' }
  }
}

const getPancakePairAddress = async (quoteToken, baseToken) => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const pancakeFactoryContract = new web3.eth.Contract(factoryAbi as AbiItem[], PANCAKE_FACTORY_ADDRESS)
  const pairAddress = await pancakeFactoryContract.methods.getPair(quoteToken, baseToken).call()
  if (pairAddress === ZERO_ADDRESS) {
    return null
  }
  return pairAddress
}

const getPriceInfo = async (input, decimals) => {
  const pancakeV2 = PANCAKE_V2_ROUTER
  const busdAddr = BUSD_ADDRESS
  const wBNBAddr = WBNB_ADDRESS
  const routerABI = [
    {
      inputs: [
        { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
        { internalType: 'address[]', name: 'path', type: 'address[]' },
      ],
      name: 'getAmountsOut',
      outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
      stateMutability: 'view',
      type: 'function',
    },
  ]
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const routerInstance = new web3.eth.Contract(routerABI as AbiItem[], pancakeV2)
    let path = [input, busdAddr]
    const pairAddress = await getPancakePairAddress(input, busdAddr)
    if (pairAddress === null) {
      path = [input, wBNBAddr, busdAddr]
      routerInstance.methods
        .getAmountsOut(web3.utils.toBN(10 ** decimals), path)
        .call()
        .then((data) => resolve(data))
    } else {
      routerInstance.methods
        .getAmountsOut(web3.utils.toBN(10 ** decimals), path)
        .call()
        .then((data) => resolve(data))
    }
  })
}

const getPrice = async (tokenAddr) => {
  try {
    if (tokenAddr === WBNB_ADDRESS) {
      const query = `{
        ethereum(network: bsc) {
          dexTrades(
            baseCurrency: {is: "${BUSD_ADDRESS}"}
            quoteCurrency: {is: "${WBNB_ADDRESS}"}
            options: {desc: ["block.height"], limit: 1}
          ) {
            block {
              height
            }
            baseCurrency {
              symbol
            }
            quoteCurrency {
              symbol
            }
            quotePrice
          }
        }
      }`

      const url = `https://graphql.bitquery.io/`
      const response = await axios.post(url, { query }, config)
      const { dexTrades } = response.data.data.ethereum

      return (1 / dexTrades[0].quotePrice).toFixed(4)
    }
    const query = `{
      ethereum(network: bsc) {
        dexTrades(
          options: {limit: 1, desc: "block.height"}
          exchangeName: {in: ["Pancake", "Pancake v2"]}
          baseCurrency: {is: "${tokenAddr}"}
          quoteCurrency: {is: "${WBNB_ADDRESS}"}
        ) {
          block {
            height
            timestamp{
              time
            }
          }
        }
      }
    }`

    const url = `https://graphql.bitquery.io/`
    const {
      data: {
        data: {
          ethereum: { dexTrades },
        },
      },
    } = await axios.post(url, { query }, config)

    if (dexTrades.length === 0) {
      return 0
    }

    const erc20ABI = [
      {
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            internalType: 'uint8',
            name: '',
            type: 'uint8',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ]
    const tokenInstance = new web3.eth.Contract(erc20ABI as AbiItem[], tokenAddr)
    const tokenDecimals = await tokenInstance.methods.decimals().call()
    const data = await getPriceInfo(tokenAddr, tokenDecimals)
    // @ts-ignore
    return parseFloat(web3.utils.fromWei(data[data.length - 1]))
  } catch (error) {
    return 0
  }
}

async function topTrades(address: string, type: 'buy' | 'sell', pairAddress) {
  if (!pairAddress) return []
  const till = new Date().toISOString()
  const since = new Date(new Date().getTime() - 3600 * 24 * 1000 * 3).toISOString()
  const query = `{
    ethereum(network: bsc) {
      dexTrades(
        options: {desc: "block.height"}
        date: {since: "${since}", till: "${till}"}
        smartContractAddress: {is: "${pairAddress}"}
        baseCurrency: {is: "${address}"}
        quoteCurrency: {is: "${WBNB_ADDRESS}"}
      ) {
        block {
          height
          timestamp {
            time
          }
        }
        transaction {
          txFrom {
            address
          }
        }
        baseCurrency {
          symbol
        }
        buyCurrency {
          symbol
        }
        sellCurrency {
          symbol
        }
        tradeAmount(in: USD)
      }
    }
  }
  `

  const url = `https://graphql.bitquery.io/`
  const {
    data: {
      data: {
        ethereum: { dexTrades },
      },
    },
  } = await axios.post(url, { query }, config)
  const wallets = []
  const tradeAmounts = []
  const keyWord = type === 'buy' ? 'sellCurrency' : 'buyCurrency'
  for (let i = 0; i < dexTrades.length; i++) {
    if (dexTrades[i].baseCurrency.symbol === dexTrades[i][keyWord].symbol) {
      if (wallets.indexOf(dexTrades[i].transaction.txFrom.address) === -1) {
        wallets.push(dexTrades[i].transaction.txFrom.address)
        tradeAmounts.push(dexTrades[i].tradeAmount)
      } else {
        const index = wallets.indexOf(dexTrades[i].transaction.txFrom.address)
        tradeAmounts[index] += dexTrades[i].tradeAmount
      }
    }
  }
  for (let i = 0; i < wallets.length - 1; i++) {
    for (let j = i + 1; j < wallets.length; j++) {
      if (tradeAmounts[j] > tradeAmounts[i]) {
        const tradeAmount = tradeAmounts[j]
        tradeAmounts[j] = tradeAmounts[i]
        tradeAmounts[i] = tradeAmount
        const wallet = wallets[i]
        wallets[i] = wallets[j]
        wallets[j] = wallet
      }
    }
  }
  const returnData = []
  for (let i = 0; i < wallets.length; i++) {
    returnData.push({
      wallet: wallets[i],
      usdAmount: tradeAmounts[i],
    })
  }
  return returnData
}

async function getMarksData(account: any, input: any, chainId = 56) {
  const network = chainId === 1 ? 'ethereum' : 'bsc'
  const query = `{
    ethereum(network: ${network}) {
      dexTrades(
        options: {desc: "block.height"}
        baseCurrency: {in: ["${WBNB_ADDRESS}", "0x55d398326f99059ff775485246999027b3197955", "0xe9e7cea3dedca5984780bafc599bd69add087d56", "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"]}
        quoteCurrency: {is: "${input}"}
        txSender: {is: "${account}"}
      ) {
        transaction {
          hash
        }
        smartContract {
          address {
            address
          }
          contractType
          currency {
            name
          }
        }
        tradeIndex
        block {
          timestamp {
            unixtime
          }
          height
        }
        buyAmount
        buyAmountInUsd: buyAmount(in: USD)
        buyCurrency {
          symbol
          address
        }
        sellAmount
        sellAmountInUsd: sellAmount(in: USD)
        sellCurrency {
          symbol
          address
        }
        sellAmountInUsd: sellAmount(in: USD)
        tradeAmount(in: USD)
        transaction {
          gasValue
          gasPrice
          gas
        }
      }
    }
  }
  `

  const url = `https://graphql.bitquery.io/`
  const {
    data: {
      data: {
        ethereum: { dexTrades },
      },
    },
  } = await axios.post(url, { query }, config)

  if (dexTrades.length === 0) {
    return new Promise((resolve) => {
      resolve([])
    })
  }

  return new Promise((resolve, reject) => {
    try {
      const data = dexTrades.map((trade) => {
        return {
          buyAmount: trade.buyAmount,
          buyCurrency: trade.buyCurrency.symbol,
          sellAmount: trade.sellAmount,
          sellCurrency: trade.sellCurrency.symbol,
          tradeAmount: trade.tradeAmount,
          time: trade.block.timestamp.unixtime,
        }
      })
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

async function getChartDurationData(input: any, quoteAddress: any, pair: any, resolution: any, to: any, countBack: any, chainId = 56) {
  const resolutionMap = {
    1: 1,
    5: 5,
    10: 10,
    15: 15,
    30: 30,
    60: 60,
    '1H': 60,
    '1D': 1440,
    '1W': 1440 * 7,
    '1M': 1440 * 30,
  }
  const minutes = resolutionMap[resolution]
  const network = chainId === ChainId.ETHEREUM ? 'ethereum' : 'bsc'
  const query = `{
      ethereum(network: ${network}) {
        dexTrades(
          options: {limit: ${countBack}, desc: "timeInterval.minute"}
          smartContractAddress: {is: "${pair}"}
          protocol: {is: "Uniswap v2"}
          baseCurrency: {is: "${input}"}
          quoteCurrency: {is: "${quoteAddress}"}
          time: {before: "${to}"}
        ) {
          exchange {
            name
          }
          timeInterval {
            minute(count: ${minutes})
          }
          baseCurrency {
            symbol
            address
          }
          baseAmount
          quoteCurrency {
            symbol
            address
          }
          quoteAmount
          trades: count
          maximum_price: quotePrice(calculate: maximum)
          minimum_price: quotePrice(calculate: minimum)
          open_price: minimum(of: time, get: quote_price)
          close_price: maximum(of: time, get: quote_price)
          tradeAmount(in: USD, calculate: sum)
        }
      }
    }
    `

  const url = `https://graphql.bitquery.io/`
  let {
    data: {
      data: {
        ethereum: { dexTrades },
      },
    },
  } = await axios.post(url, { query }, config)

  dexTrades = dexTrades.reverse()

  const quoteTokenPrice = chainId === ChainId.ETHEREUM ? await getTokenPriceETH(quoteAddress) : await getTokenPrice(quoteAddress)

  return new Promise((resolve, reject) => {
    try {
      const data = dexTrades.map((trade) => {
        const dateTest = trade.timeInterval.minute
        const year = dateTest.slice(0, 4)
        const month = dateTest.slice(5, 7)
        const day = dateTest.slice(8, 10)
        const hour = dateTest.slice(11, 13)
        const minute = dateTest.slice(14, 16)
        const date = new Date(`${month}/${day}/${year} ${hour}:${minute}:00 UTC`)
        return {
          open: trade.open_price * quoteTokenPrice,
          close: trade.close_price * quoteTokenPrice,
          low: trade.minimum_price * quoteTokenPrice,
          high: trade.maximum_price * quoteTokenPrice,
          volume: trade.tradeAmount,
          time: date.getTime(),
        }
      })
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

export {
  getTokenDetails,
  getChartStats,
  socialToken,
  topTrades,
  getPrice,
  getChartData,
  getMarksData,
  getChartDurationData,
  getTokenInfoForChart,
}
export default getTokenDetails

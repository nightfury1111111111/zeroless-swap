/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react'

import Web3 from 'web3'
import { ethers } from 'ethers'
import useAuth from 'hooks/useAuth'
import { setConnectedNetworkID } from 'state/input/actions'
import { switchNetwork } from 'utils/wallet'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useDispatch } from 'react-redux'
import { useCurrency } from './Tokens'
import useToast from './useToast'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import { useBridgeActionHandlers, useBridgeState, useDerivedBridgeInfo } from '../state/bridge/hooks'
import { maxAmountSpend } from '../utils/maxAmountSpend'
import { currencyId } from '../utils/currencyId'
import { useWalletModal } from '@sphynxdex/uikit'
import { Currency, TokenAmount, ChainId } from '@sphynxdex/sdk-multichain'
import { Field } from '../state/bridge/actions'
import ETHSwapAgentabi from "assets/abis/ETHSwapAgentImp.json"
import BSCSwapAgentabi from "assets/abis/BSCSwapAgentImp.json"
import ERC20ABI from "assets/abis/ERC20Org.json"
import { sphynxAddress, wrappedAddr } from 'config/constants/tokenHelper'
import { simpleRpcProvider, simpleRpcETHProvider } from 'utils/providers'
import { BSCBRIDGE_ADDRESS, ETHBRIDGE_ADDRESS } from 'config/constants/addresses'

export const useBridge = (isSphynx) => {
  const { account, library, chainId} = useActiveWeb3React();
  const { toastSuccess, toastError } = useToast();
  const { t } = useTranslation()
  const signer = library.getSigner();
  const dispatch = useDispatch()
  const { login, logout } = useAuth();
  const [currencyA1, setCurrencyA1] = useState('BUSD')
  const { independentField, typedValue } = useBridgeState();
  const { onPresentConnectModal } = useWalletModal(login, logout)
  const [networkFromName, setNetworkFromName] = React.useState(chainId === ChainId.MAINNET? 'bsc' : chainId === ChainId.ETHEREUM? 'eth' : 'bsc');
  const [networkToName, setNetworkToName] = React.useState(chainId === ChainId.MAINNET? 'eth' : chainId === ChainId.ETHEREUM? 'bsc' : 'eth');
  const [minAmount, setMinAmount] = React.useState(10000);
  const [maxAmount, setMaxAmount] = React.useState(1000000);
  const [approved, setApproved] = React.useState(false);
  const [erc20Addr, setERC20Addr] = React.useState(sphynxAddress[ChainId.ETHEREUM]);
  const [bep20Addr, setBEP20Addr] = React.useState(sphynxAddress[ChainId.MAINNET]);
  const [bscSwapFee, setBscSwapFee] = React.useState(0);
  const [ethSwapFee, setEthSwapFee] = React.useState(0);
  const [bscGasPrice, setBscGasPrice] = React.useState("0");
  const [ethGasPrice, setEthGasPrice] = React.useState("0");
  const [isNextClickable, setNextClickable] = React.useState(false);
  const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

  let web3Bsc = new Web3(new Web3.providers.HttpProvider('https://speedy-nodes-nyc.moralis.io/fbb4b2b82993bf507eaaab13/bsc/mainnet'))
  let web3Eth = new Web3(new Web3.providers.HttpProvider('https://speedy-nodes-nyc.moralis.io/fbb4b2b82993bf507eaaab13/eth/mainnet/archive'))
  
  
  const ethabi: any = ETHSwapAgentabi.abi
  const bscAbi: any = BSCSwapAgentabi.abi
  const erc20abi: any = ERC20ABI.abi
  
  const ethSwapContract = React.useMemo(()=> new ethers.Contract(ETHBRIDGE_ADDRESS, ethabi, simpleRpcETHProvider),[]) ;
  const ethSwapContractWeb3 = React.useMemo(()=> new web3Eth.eth.Contract(ethabi, ETHBRIDGE_ADDRESS), []);
  const bscSwapContract = React.useMemo(()=> new ethers.Contract(BSCBRIDGE_ADDRESS, bscAbi, simpleRpcProvider),[]);
  const bscSwapContractWeb3 = React.useMemo(()=> new web3Bsc.eth.Contract(bscAbi, BSCBRIDGE_ADDRESS), []) ;
  React.useEffect(()=> {
    const getFee = async () => {
      await ethSwapContractWeb3.methods.swapFee().call().then ((data)=>{
        setEthSwapFee(data);
      });
    }
    getFee()
  }, [ethSwapContractWeb3]) ;

  React.useEffect(()=> {
    const getFee = async () => {
      await bscSwapContractWeb3.methods.swapFee().call().then ((data)=>{
        setBscSwapFee(data);
      });
    }
    getFee()
    
  }, [bscSwapContractWeb3]) ;

  const erc20Contract = React.useMemo(()=> new ethers.Contract(erc20Addr, erc20abi, simpleRpcETHProvider),[erc20Addr]);
  const erc20ContractWeb3 = React.useMemo(()=> new web3Eth.eth.Contract(erc20abi, erc20Addr),[erc20Addr]);
  
  const bep20Contract = React.useMemo(()=> new ethers.Contract(bep20Addr, erc20abi, simpleRpcProvider),[]);
  const bep20ContractWeb3 = React.useMemo(()=> new web3Bsc.eth.Contract(erc20abi, bep20Addr), [bep20Addr]);
  
  React.useEffect(() => {
    const ac = new AbortController();
    if (chainId === ChainId.ETHEREUM) {
      setNetworkFromName('eth');
      setNetworkToName('bsc');
    } else if (chainId === ChainId.MAINNET) {
      setNetworkFromName('bsc');
      setNetworkToName('eth');
    }
    const isApproved = async () => {
      const maxSendTokens = maxAmount * 10 ** 18
      if (account !== undefined && erc20Addr !== '' && bep20Addr !== '') {
        const approved = chainId === ChainId.ETHEREUM ? await getETHApproveAmount(account) : await getBSCApproveAmount(account);
        if (approved >= maxSendTokens) {
          setApproved(true);
        }
      }
    }
    isApproved();
    return () => ac.abort();
  }, [chainId, account, erc20Addr, bep20Addr ])

  const isNetworkError = React.useMemo(() =>
    !((networkFromName === 'bsc' && chainId === ChainId.MAINNET) ||
      (networkFromName === 'eth' && chainId === 1))
    , [networkFromName, chainId])

  const handleFromChange = useCallback((value) => {
    setNetworkFromName(value.value);
  }, []);

  const handleToChange = useCallback((value) => {
    setNetworkToName(value.value);
  }, []);


  const handleSwitch = () => {
    if (chainId !== ChainId.MAINNET) {
      switchNetwork(ChainId.MAINNET);
      dispatch(setConnectedNetworkID({ connectedNetworkID: ChainId.MAINNET }));
    } else {
      switchNetwork(1);
      dispatch(setConnectedNetworkID({ connectedNetworkID: 1 }));
    }
  }

  const handleApprove = async () => {
    if (!isSphynx) {
      toastError(t('Operation Error'), t('Now this operation is not supported. It will be coming soon.'));
      return;
    }
    if (isNetworkError) {
      toastError(t('Operation Error'), t('You should change network.'));
      return;
    }
    if (chainId === ChainId.MAINNET)
      await onUseBSCApprove(signer, '10000000000000000000000000000');
    else if (chainId === ChainId.ETHEREUM)
      await onUseEthApprove(signer, '10000000000000000000000000000');
  }

  const handleMax = () => {
    if (isSphynx)
      onFieldSpxInput(maxAmounts[Field.BRIDGE_TOKENSPX]?.toFixed(4) ?? '')
    else
      onFieldOthInput(maxOthAmounts[Field.BRIDGE_TOKENOTH]?.toFixed(4) ?? '')
  }
  
  const onClickNext = () => {
    if (!isSphynx) {
      toastError(t('Operation Error'), t('Now this operation is not supported. It will be coming soon.'));
      setNextClickable(false);
    }

    if (isNetworkError) {
      toastError(t('Operation Error'), t('You should change network.'));
      setNextClickable(false);
    }
    const amount = isSphynx ? typedValue : Number (parsedAmounts[dependentField]?.toSignificant(4));
    if (amount === 0) {
      toastError(t('Input Error'), t('You should input amounts for bridging.'));
    } else if (amount > maxAmount) {
      toastError(t('Input Error'), t('Amounts should be less than min amounts.'));
    } else if (amount < minAmount) {
      toastError(t('Input Error'), t('Amounts should be greater than min amounts.'));
    } else {
      if (!approved) {
        toastError(t('Error'), t('You should approve this token for bridging.'));
      } else {
        try {
          setNextClickable(true);
          return;
        } catch(err) {
          if (err.data) {
            toastError('Failed', err.data.message)
          } else {
            toastError('Failed', err.message)
          }
        }
      }
    }
    //temp you should return false
    setNextClickable(false);
  };  
 
  const onConfrimClicked = async (amount)=> {
    let tx
    if (chainId === ChainId.MAINNET)
      tx = await onUseSwapBSC2ETH(signer, amount);
    else
      tx = await onUseSwapETH2BSC(signer, amount);
    const receipt = await tx.wait();;
    if (receipt.status === 1) {
      toastSuccess('Success', 'Operation successfully!')
    }
  }
  
  const currency = useCurrency(currencyA1);
  const sphynxCurrency = useCurrency(tokens.sphynx.address[chainId]);

  const {
    dependentField,
    currencyBalances,
    parsedAmounts,
  } = useDerivedBridgeInfo(sphynxCurrency ?? undefined, currency ?? undefined)

  const handleCurrencyASelect = (currencyA_: Currency) => {
    const newCurrencyIdA = currencyId(currencyA_);
    setCurrencyA1(newCurrencyIdA)
  }

  const { onFieldSpxInput, onFieldOthInput } = useBridgeActionHandlers()


  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.BRIDGE_TOKENSPX].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const maxOthAmounts: { [field in Field]?: TokenAmount } = [Field.BRIDGE_TOKENOTH].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )
 
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(4) ?? '',
  }

  useEffect(()=> {
    // if ( Number(typedValue) !== 0 && approved)
    //   onGetGasPrice(isSphynx ? typedValue : typedValue, account);
  }, [account, typedValue])

  const deepEqual = (object1, object2) => {
    if (object1 === null || object2 === null) return false
    const keys1 = Object.keys(object1)
    const keys2 = Object.keys(object2)

    if (keys1.length !== keys2.length) {
      return false
    }

    for (const key of keys1) {
      const val1 = object1[key]
      const val2 = object2[key]
      const areObjects = isObject(val1) && isObject(val2)
      if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
        return false
      }
    }
    return true
  }

  const isObject = (object) => {
    return object != null && typeof object === 'object'
  }

  const getBSCApproveAmount = async (account: string) => {
    const response = await bep20ContractWeb3.methods.allowance(account, BSCBRIDGE_ADDRESS ).call()
    return response
  }

  const getETHApproveAmount = async (account: string) => {
    const response = await erc20ContractWeb3.methods.allowance(account, ETHBRIDGE_ADDRESS ).call()
    return response
  }

  const onUseSwapBSC2ETH = async (signer, amount) => {
    const regTX = await bscSwapContract.connect(signer).swapBSC2ETH(bep20Addr, ethers.utils.parseEther(amount), { value: bscSwapFee});
    return regTX;
  };

  const onUseSwapETH2BSC = async (signer, amount) => {
      const regTX = await ethSwapContract.connect(signer).swapETH2BSC(erc20Addr, ethers.utils.parseEther(amount), { value: ethSwapFee});
      return regTX;
  };

  const onUseEthApprove = async (signer, amount) => {
    try {
      const regTX = await erc20Contract.connect(signer)
        .approve(ETHBRIDGE_ADDRESS, ethers.utils.parseEther(amount))
      const receipt = await regTX.wait()
      if (receipt.status === 1) {
        toastSuccess('Success', "Sucessfully approved");
      } 
    } catch (err) {
      if (err.data) {
        toastError('Failed', err.data.message)
      } else {
        toastError('Failed', err.message)
      }
    } finally {

    }
  };

  const onUseBSCApprove = async (signer, amount) => {
    try {
      const regTX = await bep20Contract.connect(signer)
        .approve(BSCBRIDGE_ADDRESS, ethers.utils.parseEther(amount));

      const receipt = await regTX.wait()
      if (receipt.status === 1) {
        toastSuccess('Success', "Sucessfully approved");
        setApproved(true);
      }
    } catch (err) {
      if (err.data) {
        toastError('Failed', err.data.message)
      } else {
        toastError('Failed', err.message)
      }
    } finally {
    }
  };

  const onGetGasPrice = async (amount, account) => {
    try {
      const defaultTxHash = "0x4a3ea54614839cd77081d7d576f907a8253b4087910c81c763e745109bcdd256";
      const ethOwnerAccount = '0x31D7BA3e42A1f0bba7CeA42ac5eC70FA6d0d13A8';
      const bscOwnerAccount = '0x9D0E41EAd35cE7B9a53a6E0480eBF7706EDE8daF';
      const bscLatestBlock = await web3Bsc.eth.getBlock('latest');
      const bscBlockGas = bscLatestBlock.gasLimit;
      const ethLatestBlock = await web3Eth.eth.getBlock('latest');
      const ethBlockGas = ethLatestBlock.gasLimit;
      
      if ( chainId === ChainId.MAINNET ) {
        const bscGasValue  = await bscSwapContractWeb3.methods
        .swapBSC2ETH(bep20Addr, ethers.utils.parseEther(amount)).estimateGas({from: account, value: bscSwapFee });
        const bscSwapGas = (bscBlockGas * bscGasValue) * 100;
        const bscSwapGasFinal = web3.utils.fromWei(bscSwapGas.toString(), 'ether');
        const ethGasFillValue  = await ethSwapContractWeb3.methods
        .fillBSC2ETHSwap(defaultTxHash, erc20Addr, account, ethers.utils.parseEther(amount)).estimateGas({from: ethOwnerAccount});
        const ethFillGas = (ethBlockGas * ethGasFillValue) * 100;
        const ethFillGasFinal = web3.utils.fromWei(ethFillGas.toString(), 'ether');  
        setBscGasPrice(bscSwapGasFinal);
        setEthGasPrice(ethFillGasFinal);
      } else {
        const ethGasValue  = await ethSwapContractWeb3.methods
        .swapETH2BSC(bep20Addr, ethers.utils.parseEther(amount)).estimateGas({from: account, value: ethSwapFee });

        const bscGasFillValue  = await bscSwapContractWeb3.methods
        .fillETH2BSCSwap( defaultTxHash, bep20Addr, account, ethers.utils.parseEther(amount)).estimateGas({from: bscOwnerAccount});

        const ethSwapGas = (ethBlockGas * ethGasValue) * 100;
        const ethSwapGasFinal = web3.utils.fromWei(ethSwapGas.toString(), 'ether');

        const bscFillGas = (bscBlockGas * bscGasFillValue) * 100;
        const bscFillGasFinal = web3.utils.fromWei(bscFillGas.toString(), 'ether');

        setBscGasPrice(bscFillGasFinal);
        setEthGasPrice(ethSwapGasFinal);
      }
    } catch (err) {
      console.log(err)
      if (err.data) {
        console.log("error", err.data.message);
        if (err?.data?.message !== undefined && err?.data?.message !== null)
          toastError('Failed', err?.data?.message)
        else
          toastError('Failed', "execution_reverted: insuffient-fee")  
      } else if (err.message) {
        toastError('Failed', err.message)
      } else {
        toastError('Failed', "execution_reverted: insuffient-fee")
      }
    } finally {
    }
  };

  return {
    account,
    chainId,
    approved,
    maxAmounts,
    bscGasPrice,
    ethGasPrice,
    bscSwapFee,
    ethSwapFee,
    isNextClickable,
    setNextClickable,
    maxOthAmounts,
    independentField,
    dependentField,
    parsedAmounts,
    formattedAmounts,
    typedValue,
    networkToName,
    currency,
    sphynxCurrency,
    maxAmount,
    minAmount,
    networkFromName,
    onGetGasPrice,
    onFieldSpxInput,
    onFieldOthInput,
    onPresentConnectModal,
    onClickNext,
    onConfrimClicked,
    handleToChange,
    handleFromChange,
    handleSwitch,
    handleApprove,
    handleMax,
    handleCurrencyASelect,
  }
}

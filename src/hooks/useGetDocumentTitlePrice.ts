import { useEffect } from 'react'
import { useSphynxBusdPrice } from 'hooks/useBUSDPrice'

const useGetDocumentTitlePrice = () => {
  const sphynxPriceBusd = useSphynxBusdPrice()
  useEffect(() => {
    const sphynxPriceBusdString = sphynxPriceBusd ? sphynxPriceBusd.toFixed(2) : ''
    document.title = `Sphynx Swap - ${sphynxPriceBusdString}`
  }, [sphynxPriceBusd])
}
export default useGetDocumentTitlePrice

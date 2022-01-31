import { SVGProps } from 'react'
import { ContextApi } from 'contexts/Localization/types'
import { ReactComponent as FarmIcon } from 'assets/svg/icon/FarmIcon.svg'
import { ReactComponent as PoolIcon } from 'assets/svg/icon/PoolIcon.svg'
import { ReactComponent as BridgeIcon } from 'assets/svg/icon/Bridge.svg'
import { ReactComponent as LaunchPadIcon } from 'assets/svg/icon/LaunchIcon.svg'
import { ReactComponent as PredictionIcon } from 'assets/svg/icon/PredictionIcon.svg'
import { ReactComponent as IFOIcon } from 'assets/svg/icon/IFOIcon.svg'
import { ReactComponent as ChartIcon } from 'assets/svg/icon/chart-swap.svg'
import { ReactComponent as CoingeckoIcon } from 'assets/svg/icon/Coingecko.svg'
import { ReactComponent as CoinMarketCapsIcon } from 'assets/svg/icon/CoinMarketCaps.svg'
import { ReactComponent as LearningHubIcon } from 'assets/svg/icon/LearningHub.svg'
import { ReactComponent as FAQIcon } from 'assets/svg/icon/HelpIcon.svg'
import { ReactComponent as LockIcon } from 'assets/svg/icon/LockIcon.svg'

export const links = [
  {
    label: 'Swap & charts (live)',
    icon: ChartIcon,
    href: '/swap',
  },
  {
    label: 'Farms (live)',
    icon: FarmIcon,
    href: '/farms',
  },
  {
    label: 'Pools (live)',
    icon: PoolIcon,
    href: '/pools',
  },
  {
    label: 'Sphynx pad (live)',
    icon: LaunchPadIcon,
    href: '/launchpad',
  },
  {
    label: 'Projects live on Sphynx (live)',
    icon: PredictionIcon,
    href: '/launchpad/listing',
  },
  {
    label: 'Sphynx Lock (coming soon)',
    icon: PredictionIcon,
    href: '/locker/manage',
  },
  {
    label: 'Sphynx Lockers (coming soon)',
    icon: LockIcon,
    href: '/locker',
  },
  {
    label: 'Sphynx fair pad (live)',
    icon: LaunchPadIcon,
    href: '/fair-launchpad',
  },
  {
    label: 'Projects on Sphynx fair (live)',
    icon: PredictionIcon,
    href: '/fair-launchpad/listing',
  },
  {
    label: 'Lottery (coming soon)',
    icon: IFOIcon,
    href: '/lottery',
  },
  {
    label: 'Bridge (coming soon)',
    icon: BridgeIcon,
    href: '/bridge',
  },
  {
    label: 'CoinMarketCap',
    icon: CoinMarketCapsIcon,
    href: 'https://coinmarketcap.com/',
    newTab: true
  },
  {
    label: 'CoinGecko',
    icon: CoingeckoIcon,
    href: 'https://www.coingecko.com/en',
    newTab: true
  },
  {
    label: 'Learning Hub',
    icon: LearningHubIcon,
    href: 'https://www.sphynxlearning.co/',
    newTab: true
  },
  {
    label: 'NFT Marketplace (coming soon)',
    icon: PredictionIcon,
    href: '/',
  },
  {
    label: 'Prediction (coming soon)',
    icon: PredictionIcon,
    href: '/',
  },
  {
    label: 'Submit a help ticket',
    icon: FAQIcon,
    href: 'https://forms.monday.com/forms/92bea15323975e375a8b5468a159a3bf?r=use1',
  },
]

interface MenuSubEntry {
  label: string
  href: string
}

interface MenuEntry {
  label: string
  icon: React.FunctionComponent<SVGProps<SVGSVGElement>>
  items?: MenuSubEntry[]
  href?: string
}

const config: (t: ContextApi['t']) => MenuEntry[] = () => links

export default config

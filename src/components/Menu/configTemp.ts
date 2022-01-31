import { SVGProps } from 'react'
import { ContextApi } from 'contexts/Localization/types'
import { ReactComponent as FarmIcon } from 'assets/svg/icon/FarmIcon.svg'
import { ReactComponent as PoolIcon } from 'assets/svg/icon/PoolIcon.svg'
import { ReactComponent as BridgeIcon } from 'assets/svg/icon/Bridge.svg'
import { ReactComponent as LaunchPadIcon } from 'assets/svg/icon/LaunchIcon.svg'
import { ReactComponent as PredictionIcon } from 'assets/svg/icon/PredictionIcon.svg'
import { ReactComponent as IFOIcon } from 'assets/svg/icon/IFOIcon.svg'
import { ReactComponent as ChartIcon } from 'assets/svg/icon/chart-swap.svg'
import { ReactComponent as LearningHubIcon } from 'assets/svg/icon/LearningHub.svg'
import { ReactComponent as FAQIcon } from 'assets/svg/icon/HelpIcon.svg'
import { ReactComponent as LockIcon } from 'assets/svg/icon/LockIcon.svg'
import { PredictionsIcon } from '@sphynxdex/uikit'

export const linksTemp = [
  // {
  //   baseurl: 'swap',
  //   name: 'DEX & Charts',
  //   Icon: ChartIcon,
  //   link: '/swap',
  // },
  // {
  //   baseurl: 'farms',
  //   name: 'Farms',
  //   Icon: FarmIcon,
  //   link: '/farms',
  // },
  // {
  //   baseurl: 'pools',
  //   name: 'Staking Pools',
  //   Icon: PoolIcon,
  //   link: '/pools',
  // },
  // {
  //   baseurl: 'launchpad',
  //   name: 'ZerolessPad',
  //   Icon: LaunchPadIcon,
  // items: [
  {
    baseurl: 'launchpad',
    Icon: LaunchPadIcon,
    name: 'LaunchPad',
    link: '/launchpad',
  },
  {
    baseurl: 'listing',
    Icon: PoolIcon,
    name: 'Presale Directory',
    link: '/listing',
  },
  // {
  //   name: 'Fair Launch',
  //   link: '/launchpad/fair'
  // },
  // {
  //   name: 'Fair Launch Directory',
  //   link: '/launchpad/fair/listing'
  // },
  // {
  //   name: 'Lock Tokens/Liquidity',
  //   link: '/launchpad/locker/manage'
  // },
  // {
  //   name: 'Lockers',
  //   link: '/launchpad/locker'
  // },
  // ],
  // },
  // {
  //   baseurl: 'bridge',
  //   name: 'Bridge',
  //   Icon: BridgeIcon,
  //   link: '/bridge'
  // },
  // {
  //   baseurl: 'nft',
  //   name: 'SSC(NFT)',
  //   Icon: PredictionIcon,
  //   link: 'https://sovereignsphynxcouncil.co/'
  // },
  // {
  //   baseurl: 'lottery',
  //   name: 'Lottery',
  //   Icon: IFOIcon,
  //   link: '/lottery'
  // },
  // {
  //   baseurl: 'faq',
  //   name: 'Submit a help ticket',
  //   Icon: FAQIcon,
  //   link: 'https://forms.monday.com/forms/92bea15323975e375a8b5468a159a3bf?r=use1'
  // },
  // {
  //   baseurl: 'learninghub',
  //   name: 'Learning Hub',
  //   Icon: LearningHubIcon,
  //   link: 'https://www.sphynxlearning.co/'
  // },
]

interface MenuSubEntry {
  name: string
  link: string
}

interface MenuEntry {
  name: string
  Icon: React.FunctionComponent<SVGProps<SVGSVGElement>>
  items?: MenuSubEntry[]
  link?: string
}

const config: (t: ContextApi['t']) => MenuEntry[] = () => linksTemp

export default config

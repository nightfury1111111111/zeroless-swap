import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Sphynx',
  description: '',
  image: '',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Sphynx Token')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Sphynx Token')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Sphynx Token')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Sphynx Token')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Sphynx Token')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('PancakeSwap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('PancakeSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('PancakeSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('PancakeSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('PancakeSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('PancakeSwap')}`,
      }
    default:
      return null
  }
}

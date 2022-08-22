import L2tpProtocol from './l2tp'
import PptpProtocol from './pptp'
import OpenvpnProtocol from './openvpn'
import WireguardProtocol from './wireguard'
import ShadowsocksProtocol from './shadowsocks'
import Socks5Protocol from './socks5'
import OwncloudProtocol from './owncloud'
import NextcloudProtocol from './nextcloud'
import TorbridgeProtocol from './torbridge'

export const TYPE_L2TP = 'l2tp'
export const TYPE_PPTP = 'pptp'
export const TYPE_OPENVPN = 'openvpn'
export const TYPE_WIREGUARD = 'wireguard'
export const TYPE_SHADOWSOCKS = 'shadowsocks'
export const TYPE_SOCKS5 = 'socks5'
// extra
export const TYPE_OWNCLOUD = 'owncloud'
export const TYPE_NEXTCLOUD = 'nextcloud'
export const TYPE_TORBRIDGE = 'torbridge'

export class ProtocolFactory {
  static create(name, params) {
    switch (name) {
      case TYPE_L2TP:
        return new L2tpProtocol(params)
      case TYPE_PPTP:
        return new PptpProtocol(params)
      case TYPE_OPENVPN:
        return new OpenvpnProtocol(params)
      case TYPE_WIREGUARD:
        return new WireguardProtocol(params)
      case TYPE_SHADOWSOCKS:
        return new ShadowsocksProtocol(params)
      case TYPE_SOCKS5:
        return new Socks5Protocol(params)
      case TYPE_OWNCLOUD:
        return new OwncloudProtocol(params)
      case TYPE_NEXTCLOUD:
        return new NextcloudProtocol(params)
      case TYPE_TORBRIDGE:
        return new TorbridgeProtocol(params)
      default:
        throw new Error(`Unknown protocol ${name}`)
    }
  }
}

export const PROTOCOL_CODES = [
  { code: 1, type: TYPE_L2TP },
  { code: 2, type: TYPE_PPTP },
  { code: 3, type: TYPE_OPENVPN },
  { code: 4, type: TYPE_WIREGUARD },
  { code: 5, type: TYPE_SHADOWSOCKS },
  { code: 6, type: TYPE_SOCKS5 },
  { code: 7, type: TYPE_OWNCLOUD },
  { code: 8, type: TYPE_NEXTCLOUD },
  { code: 9, type: TYPE_TORBRIDGE },
]

export const PROTOCOL_LIST = [
  {
    key: TYPE_L2TP,
    title: 'L2TP',
  },
  {
    key: TYPE_PPTP,
    title: 'PPTP',
  },
  {
    key: TYPE_OPENVPN,
    title: 'OpenVPN',
  },
  {
    key: TYPE_WIREGUARD,
    title: 'WireGuard',
  },
  {
    key: TYPE_SHADOWSOCKS,
    title: 'Shadowsocks',
  },
  {
    key: TYPE_SOCKS5,
    title: 'SOCKS5',
  },
  {
    key: TYPE_OWNCLOUD,
    title: 'ownCloud',
  },
  {
    key: TYPE_NEXTCLOUD,
    title: 'NextCloud',
  },
  {
    key: TYPE_TORBRIDGE,
    title: 'Tor Bridge',
  },
]

import L2tpProtocol from "./l2tp";
import PptpProtocol from "./pptp";
import OpenvpnProtocol from "./openvpn";
import WireguardProtocol from "./wireguard";
import ShadowsocksProtocol from "./shadowsocks";
import Socks5Protocol from "./socks5";

export const TYPE_L2TP = 'l2tp'
export const TYPE_PPTP = 'pptp'
export const TYPE_OPENVPN = 'openvpn'
export const TYPE_WIREGUARD = 'wireguard'
export const TYPE_SHADOWSOCKS = 'shadowsocks'
export const TYPE_SOCKS5 = 'socks5'

export class ProtocolFactory {
  static create (name, params) {
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
      default:
        throw new Error(`Unknown protocol ${name}`)
    }
  }
}

export const PROTOCOL_CODES = [
  {code: 1, type: TYPE_L2TP},
  {code: 2, type: TYPE_PPTP},
  {code: 3, type: TYPE_OPENVPN},
  {code: 4, type: TYPE_WIREGUARD},
  {code: 5, type: TYPE_SHADOWSOCKS},
  {code: 6, type: TYPE_SOCKS5},
]

export const PROTOCOL_LIST = [
  {
    key: TYPE_L2TP,
    title: 'L2TP'
  },
  {
    key: TYPE_PPTP,
    title: 'PPTP'
  },
  {
    key: TYPE_OPENVPN,
    title: 'OpenVPN'
  },
  {
    key: TYPE_WIREGUARD,
    title: 'WireGuard'
  },
  {
    key: TYPE_SHADOWSOCKS,
    title: 'Shadowsocks'
  },
  {
    key: TYPE_SOCKS5,
    title: 'SOCKS5'
  }
]
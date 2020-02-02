import {ProviderCryptoServers} from './providerCryptoServers'
import {ProviderDigitalOcean} from './providerDigitalOcean'
import {ProviderLinodeServers} from './providerLinodeServers'
import {ProviderHetznerCloud} from './providerHetznerCloud'

export class ProviderFactory {
  static register (name, config) {
    switch (name) {
      case DIGITALOCEAN_KEY:
        return new ProviderDigitalOcean(config)
      case CRYPTOSERVERS_KEY:
        return new ProviderCryptoServers(config)
      case LINODE_KEY:
        return new ProviderLinodeServers(config)
      case HETZNER_CLOUD_KEY:
        return new ProviderHetznerCloud(config)
      default:
        throw new Error(`Unknown provider ${name}`)
    }
  }
}

export const DIGITALOCEAN_KEY = 'digitalocean'
export const CRYPTOSERVERS_KEY = 'cryptoservers'
export const LINODE_KEY = 'linode'
export const HETZNER_CLOUD_KEY = 'hetznerCloud'

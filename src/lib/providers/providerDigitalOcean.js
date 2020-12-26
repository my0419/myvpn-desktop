
import {sleep} from '../urils'
import {ProviderBase} from './providerBase'
import storeType from '../../renderer/store/modules/type'

export class ProviderDigitalOcean extends ProviderBase {

  constructor (config) {
    super(config)
    const { apikey } = this.config
    this.client = require('digitalocean').client(apikey)
  }

  async identifyAccess () {
    try {
      let account = await this.client.account.get((_, account) => account)
      if (account.status !== 'active') {
        throw new Error(`Your account is not active`)
      }
      return true
    } catch (e) {
      throw new Error(e.message.replace('Unable to authenticate you.', 'You entered an incorrect key. Authentication failed.'))
    }
  }

  async regions () {
    let regions = await this.client.regions.list()
    return regions.filter(v => v.name).map(v => ({
      name: v.name.replace(' 1', ''),
      slug: v.slug,
      available: v.available,
      speedtest: 'http://speedtest-' + v.slug.replace('-', '') + '.digitalocean.com/'
    })).sort((a, b) => a.name.localeCompare(b.name))
  }

  async serverList () {
    let res = await this.client.droplets.list(1, 200).filter(v => {
      return v.name && v.name.includes('vpn-')
    })
    res = res.map(v => {
      v.networks.v4 = v.networks.v4.filter(fv => fv.type === 'public')
      return v
    })
    return res
  }

  async deleteServer (id) {
    let res = await this.client.droplets.delete(id, (_, res) => res)
    return res
  }

  async addSshKey (publicKey) {
    let name = 'vpn-' + Math.random().toString(36).substring(7)
    const res = await this.client.account.createSshKey({'public_key': publicKey, name})
    return res.id
  }

  async deleteSshKey (id, dropletId) {
    await this.client.account.deleteSshKey(id)
  }

  async createServer (sshKeyId, region, protocol, startupCommand) {
    let protocolCode = storeType.codes.filter(v => v.type === protocol)[0].code
    let name = 'vpn-'+protocolCode+'-' + Math.random().toString(36).substring(7)
    let dropletCfg = {
      name,
      region,
      size: '1gb',
      image: 'debian-9-x64',
      ssh_keys: [sshKeyId],
      user_data: startupCommand,
      backups: false
    }
    let droplet = await this.client.droplets.create(dropletCfg)
    return {
      name,
      slug: droplet.id,
      ipv4: null
    }
  }

  async checkServer (id) {
    let locked = true
    let droplet = null
    while (locked) {
      await sleep(6000)
      droplet = await this.client.droplets.get(id)
      if (droplet.status === 'active') {
        locked = droplet.locked
      }
    }
    return {
      name: droplet.name,
      slug: id,
      ipv4: droplet.networks.v4.filter(fv => fv.type === 'public')[0].ip_address
    }
  }

}

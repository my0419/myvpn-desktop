import {ProviderBase} from './providerBase'
import axios from 'axios'
import {sleep} from '../urils'
import storeType from '../../renderer/store/modules/type'

export class ProviderCryptoServers extends ProviderBase {

  constructor (config) {
    super(config)
    const { apikey } = this.config
    this.client = axios.create({
      baseURL: 'https://cryptoservers.net/api/v1/',
      timeout: 3 * 60 * 1000, // 3 min
      headers: {'Authorization': apikey, 'Accept-Language': navigator.language === 'ru' ? 'ru' : 'en'},
    });
  }

  async identifyAccess () {
    await this.client.get('/regions').then(r => r,err => {
      let errMessage = 'You entered an incorrect key. Authentication failed.'
      throw new Error(err.response.data ? err.response.data.error.replace('Invalid API key.', errMessage) : errMessage)
    })
  }

  async regions () {
    let regions = await this.client.get('/regions').then(res => {
      return res.data
    },res => {
      throw new Error(res.response.data.error || 'Failed get region list')
    })
    return regions.filter(v => v.name).map(v => ({
      name: v.name.replace(' 1', ''),
      slug: v.slug, available: v.available,
      speedtest: 'http://speedtest-' + v.slug.replace('-', '') + '.digitalocean.com/'
    })).sort((a, b) => a.name.localeCompare(b.name))
  }

  async serverList () {
    let droplets = await this.client.get('/droplet/list').then(res => {
      return res.data.map(v => {
        let data = v.data
        data.id = v.id
        data.networks = {v4: [{ip_address: data.networks.filter(fv => fv.type === 'public')[0].ipAddress}]}
        data.created_at = data.createdAt
        return data
      })
    },res => {
      throw new Error(res.response.data.error || 'Failed get server list')
    })
    return droplets.filter(v => v.name && v.name.includes('vpn-'))
  }

  async deleteServer (id) {
    await this.client.get('/droplet/delete/'+id).then(r => r,err => {
      throw new Error('Failed delete server. Please try again.')
    })

  }

  async addSshKey (publicKey) {
    let name = 'vpn-' + Math.random().toString(36).substring(7)
    return await this.client.post('/ssh/create', {name, key: publicKey}).then(res => {
      return res.data.ssh_key_id
    },res => {
      throw new Error(res.response.data.error || 'Failed add SSH Key')
    })
  }

  async deleteSshKey (id, dropletId) {
    await this.client.get(`/ssh/delete/${dropletId}/${id}`).then(r => {
    },res => {
      console.log('Failed delete SSH key: '+res.response.data.error)
    })
  }

  async createServer (sshKeyId, region, protocol, startupCommand) {
    let protocolCode = storeType.codes.filter(v => v.type === protocol)[0].code
    let name = 'vpn-'+protocolCode+'-' + Math.random().toString(36).substring(7)
    const params = {name, region, ssh_key_id: sshKeyId, user_data: startupCommand}
    let droplet = await this.client.post('/droplet/create', params).then(res => {
      return res.data.droplet
    },res => {
      throw new Error(res.response.data.error || 'Failed create droplet')
    })
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
      await sleep(5000)
      console.warn('check status for', id)
      droplet = await this.client.get(`/droplet/check/${id}`).then(res => {
        return res.data
      },res => {
        throw new Error(res.response.data.error || 'Failed check server status')
      })

      if (droplet.status !== 'new') {
        locked = droplet.locked
      }
    }
    return {
      name: droplet.name,
      slug: id,
      ipv4: droplet.networks && droplet.networks.length > 0 ? droplet.networks[0].ipAddress : null
    }
  }

}

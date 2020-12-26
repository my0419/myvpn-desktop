import {ProviderBase} from './providerBase'
import axios from 'axios'
import {sleep} from '../urils'
import storeType from "../../renderer/store/modules/type";

export class ProviderHetznerCloud extends ProviderBase {

  constructor (config) {
    super(config)
    const { apikey } = this.config
    this.client = axios.create({
      baseURL: 'https://api.hetzner.cloud/v1/',
      timeout: 3 * 60 * 1000, // 3 min
      headers: {'Authorization': `Bearer ${apikey}`, 'Accept-Language': navigator.language === 'ru' ? 'ru' : 'en'},
    });
  }

  async identifyAccess () {
    await this.client.get('/locations').then(r => r,err => {
      throw new Error(err.response.data.error.message.replace('unable to authenticate', 'You entered an incorrect key. Authentication failed.'))
    })
  }

  async regions () {
    let regions = await this.client.get('/locations').then(res => {
      return res.data.locations
    },res => {
      throw new Error(res.response.data.error.message || 'Failed get region list')
    })
    return regions.filter(v => v.name).map(v => ({
      name: v.description.replace(' DC Park 1', ''),
      slug: v.name, available: true,
      speedtest: false
    })).sort((a, b) => a.name.localeCompare(b.name))
  }

  async serverList () {
    let droplets = await this.client.get('/servers').then(res => {
      return res.data.servers.map(v => {
        console.log(v)

        let data = v
        data.id = v.id
        data.region = {
          name: v.datacenter.location.description,
          slug: v.datacenter.location.name
        }
        data.image = {
          distribution: '',
          name: v.image.description
        }
        data.networks = {v4: [{ip_address: data.public_net.ipv4.ip}]}
        data.created_at = data.created
        return data
      })
    },res => {
      throw new Error(res.response.data.error.message || 'Failed get server list')
    })
    return droplets.filter(v => v.name && v.name.includes('vpn-'))
  }

  async deleteServer (id) {
    await this.client.delete(`/servers/${id}`).then(r => r,err => {
      throw new Error('Failed delete server. Please try again.')
    })

  }

  async addSshKey (publicKey) {
    let name = 'vpn-' + Math.random().toString(36).substring(7)
    return await this.client.post('/ssh_keys', {name, public_key: publicKey}).then(res => {
      return res.data.ssh_key.id
    },res => {
      throw new Error(res.response.data.error.message || 'Failed add SSH Key')
    })
  }

  async deleteSshKey (id, dropletId) {
    await this.client.delete(`/ssh_keys/${id}`).then(r => {
    },res => {
      console.log('Failed delete SSH key: '+res.response.data.error.message)
    })
  }

  async createServer (sshKeyId, region, protocol, startupCommand) {
    let protocolCode = storeType.codes.filter(v => v.type === protocol)[0].code
    let name = 'vpn-'+protocolCode+'-' + Math.random().toString(36).substring(7)
    const type = await this.client.get('/server_types',).then(res => {
      let typeItem = res.data.server_types[0] || null
      if (typeItem === null) {
        throw new Error('Failed get server types')
      }
      return typeItem
    },res => {
      throw new Error('Failed get types')
    })

    const params = {
      name,
      server_type: type.id,
      start_after_create: true,
      image: 'debian-9',
      ssh_keys: [sshKeyId],
      user_data: startupCommand,
      location: region,
    }
    let server = await this.client.post('/servers', params).then(res => {
      return res.data.server
    },res => {
      throw new Error(res.response.data.error.message || 'Failed create droplet')
    })
    return {
      name,
      slug: server.id,
      ipv4: null
    }
  }

  async checkServer (id) {
    let locked = true
    let server = null
    while (locked) {
      await sleep(5000)
      console.warn('check status for', id)
      server = await this.client.get(`/servers/${id}`).then(res => {
        return res.data.server
      },res => {
        throw new Error(res.response.data.error.message || 'Failed check server status')
      })
      if (server.status === 'running') {
        locked = false
      }
    }
    return {
      name: server.name,
      slug: id,
      ipv4: server.public_net && server.public_net.ipv4 && server.public_net.ipv4.ip ? server.public_net.ipv4.ip : null
    }
  }

}

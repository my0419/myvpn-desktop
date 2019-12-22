import {ProviderBase} from './providerBase'
import axios from 'axios'
import {sleep} from '../urils'

const LINODE_REGIONS = {
  'ap-west': {title: 'India (Mumbai)', speedtest: 'mumbai1'},
  'ca-central': {title: 'Canada (Toronto)', speedtest: 'toronto1'},
  'us-southeast': {title: 'US Southeast (Atlanta)', speedtest: 'atlanta'},
  'us-west': {title: 'US West (Fremont)', speedtest: 'fremont'},
  'us-east': {title: 'US East (Newark)',  speedtest: 'newark'},
  'us-central': {title: 'US Central (Dallas)', speedtest: 'dallas'},
  'eu-west': {title: 'EU West (London)', speedtest: 'london'},
  'ap-south': {title: 'AP South (Singapore)', speedtest: 'singapore'},
  'eu-central': {title: 'EU Central (Frankfurt)', speedtest: 'frankfurt'},
  'ap-northeast': {title: 'AP Northeast (Tokyo)', speedtest: 'tokyo2'},
}

export class ProviderLinodeServers extends ProviderBase {

  constructor (config) {
    super(config)
    const { apikey } = this.config
    this.client = axios.create({
      baseURL: 'https://api.linode.com/v4/',
      timeout: 3 * 60 * 1000, // 3 min
      headers: {'Authorization': `Bearer ${apikey}`},
    });
    this.sshKey = null
    this.rootPassword = `Myvpn${Math.random().toString(20).substring(2)}@2`
  }

  async identifyAccess () {
    await this.client.get('linode/instances').then(r => r,err => {
      throw new Error(err.response.data.errors[0].reason.replace('Invalid OAuth Token', 'You entered an incorrect key. Authentication failed.'))
    })
  }

  async regions () {
    let regions = await this.client.get('regions').then(res => {
      return res.data
    },res => {
      throw new Error(err.response.data.errors.length > 0 ? err.response.data.errors[0].reason : 'Failed get region list')
    })
    return regions.data.map(v => {
      let regionInfo = LINODE_REGIONS[v.id] || null
      return {
        name: (regionInfo ? regionInfo.title : null) || `${v.country} (${v.id})`,
        slug: v.id,
        speedtest: regionInfo ? `http://speedtest.${regionInfo.speedtest}.linode.com/empty.php`  : null,
        available: true
      }
    }).sort((a, b) => a.name.localeCompare(b.name))
  }

  async serverList () {
    let droplets = await this.client.get('linode/instances').then(res => {
      return res.data.data.map(v => {
        return {
          id: v.id,
          name: v.label,
          region: {name: v.region},
          status: v.status,
          networks: {v4: [{ip_address: v.ipv4[0]}]},
          created_at: v.created,
          image: {name: v.image, distribution: ''},
          locked: v.status !== 'running',
        }
      })
    },err => {
      throw new Error(err.response.data.errors.length > 0 ? err.response.data.errors[0].reason : 'Failed get server list')
    })
    return droplets.filter(v => v.name && v.name.includes('vpn-'))
  }

  async deleteServer (id) {
    await this.client.delete('linode/instances/'+id).then(r => r,err => {
      throw new Error('Failed delete server.')
    })

  }

  async addSshKey (publicKey) {
    this.sshKey = publicKey
  }

  async deleteSshKey (id, dropletId) {}

  async createServer (sshKeyId, region) {
    let name = 'vpn-' + Math.random().toString(36).substring(7)
    let type = await this.client.get('linode/types',).then(res => {
      let typeItem = res.data.data[0] || null
      if (typeItem === null) {
        throw new Error( 'Failed get server types')
      }
      return typeItem
    },err => {
      throw new Error( 'Failed get types')
    })
    return await this.client.post('linode/instances', {
      label: name,
      region,
      type: type.id,
      root_pass: this.rootPassword,
      authorized_keys: [this.sshKey],
      image: 'linode/debian9'
    }).then(res => {
      return {
        slug: res.data.id,
        name: res.data.label,
        password: this.rootPassword,
        ipv4: null,
      }
    },err => {
      throw new Error(err.response.data.errors.length > 0 ? err.response.data.errors[0].reason : 'Failed get server list')
    })
  }

  async checkServer (id) {
    let locked = true
    let droplet = null
    while (locked) {
      await sleep(5000)
      console.warn('check status for', id)
      droplet = await this.client.get(`linode/instances/${id}`).then(res => {
        return res.data
      },res => {
        throw new Error('Failed check status')
      })
      if (droplet.status === 'running') {
        locked = false
      }
    }
    return {
      name: droplet.name,
      slug: id,
      ipv4: droplet.ipv4.length > 0 ? droplet.ipv4[0] : null,
      password: this.rootPassword
    }
  }

}

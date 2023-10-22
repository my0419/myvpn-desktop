# MyVPN - The best solution for a personal VPN server!

Open source desktop application for the personal VPN server.

### Website

https://myvpn.run

### Online version

https://tool.myvpn.run

### Preview

![Screenshot](preview.png)

### Stack

* ElectronJS
* VueJS
* [ElementUI](https://element.eleme.io/)
* [MyVPN Agent](https://github.com/my0419/myvpn-agent)
* [ssh2](https://github.com/mscdex/ssh2)

### Providers

* [CryptoServers](https://cryptoservers.net/)
* [DigitalOcean](https://www.digitalocean.com/)
* [Linode](https://linode.com/)
* [Hetzner Cloud](https://www.hetzner.com/cloud)
* Other providers (Using SSH protocol)


### VPN protocols

1. L2TP/IPSec
2. IKEv2/IPSec
3. OpenConnect
4. PPTP
5. OpenVPN
6. [WireGuard](https://www.wireguard.com/)
7. Shadowsocks (Support V2Ray Plugin)
8. SOCKS5

### Other Software

* ownCloud
* NextCloud
* Tor Bridge

### Languages

* English
* Russian

### Requirements

* [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)

### Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload
yarn dev

```

### Build for platform

#### Windows x64 (.exe)

``` bash
yarn build:windows
```

#### Linux Debian / Ubuntu (.deb) and Other (.tar.bz2)

``` bash
yarn build:linux
```

#### MacOS (.dmg)

``` bash
yarn build:mac
```

### Official Website

[www.myvpn.run](http://myvpn.run)

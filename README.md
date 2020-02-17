# MyVPN - The best solution for a personal VPN server!

Open source desktop application for the personal VPN server.

![Screenshot](preview.png)
![Screenshot](preview2.png)

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

* L2TP
* PPTP
* OpenVPN
* [WireGuard](https://www.wireguard.com/)
* Shadowsocks (with optional V2Ray Plugin)

### Languages

* English
* Russian

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload
npm run dev

```

### Build for platform

#### Windows x64 (.exe)

``` bash
npm run build:windows
```

#### Linux Debian / Ubuntu (.deb) and Other (.tar.bz2)

``` bash
npm run build:linux
```

#### MacOS (.dmg)

``` bash
npm run build:mac
```

### Official Website

[www.myvpn.run](http://myvpn.run)

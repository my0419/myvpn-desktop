# MyVPN - The best solution for a personal VPN server!

Open source desktop application for the personal VPN server.

![Screenshot](preview.png)

### Stack

* ElectronJS
* VueJS
* [ElementUI](https://element.eleme.io/)
* [ssh2](https://github.com/mscdex/ssh2)

### Providers

* [CryptoServers](https://cryptoservers.net/)
* [DigitalOcean](https://www.digitalocean.com/)
* [Linode](https://linode.com/)


### VPN protocols

* L2TP
* PPTP
* OpenVPN
* [WireGuard](https://www.wireguard.com/)

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
npm run build --platform=win --arch=x64
```

#### Windows x32 (.exe)

``` bash
npm run build --platform=win32
```

#### Linux Debian / Ubuntu (.deb)

``` bash
npm run build --linux deb
```

#### Linux (.tar.bz2)

``` bash
npm run build --linux tar.bz2
```

#### MacOS (.dmg)

``` bash
npm run build --platform=mac
```

### Official Website

[www.myvpn.run](http://myvpn.run/) (russian language)

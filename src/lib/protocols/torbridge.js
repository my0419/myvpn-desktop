import BaseProtocol from "./base";

class TorbridgeProtocol extends BaseProtocol {

    /**
     * @returns {Object}
     */
    envVariables () {
        const torbridge = this.params.setting.torbridge
        return Object.assign(super.envVariables(), {
            'OR_PORT': torbridge.orPort,
            'PT_PORT': torbridge.ptPort,
            'NICKNAME': torbridge.nickname,
            'EMAIL': torbridge.email,
        })
    }

}

export default TorbridgeProtocol
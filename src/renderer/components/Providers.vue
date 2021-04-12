<template>
  <ProviderChoosen>
    <template v-slot:providerItem="{ provider }">
      <div>
        <ProviderSelf v-if="provider.name === 'custom'" />
        <ProviderAccount v-else
          :provider-key="provider.name"
          :provider-name="provider.title"
          :provider-website="provider.website"
          :faq-link="provider.faq"
          :oauthConfig="provider.oauthConfig || null"
          :oauth-window-height="(provider.oauthWindow) ? provider.oauthWindow.height : null"
          :oauth-window-width="(provider.oauthWindow) ? provider.oauthWindow.width : null"
          :via-key="provider.viaKey || false"
        />
      </div>
    </template>
  </ProviderChoosen>
</template>

<script>
  import ProviderAccount from './ProviderAccount'
  import ProviderSelf from "./ProviderSelf";
  import ProviderChoosen from './ProviderChoosen';

  export default {
    components: {ProviderSelf, ProviderAccount, ProviderChoosen}
  }
</script>

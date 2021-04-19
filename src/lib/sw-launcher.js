import { isMobile, localStorageService } from '../lib/utils'

function swLauncher (isBrowser, document) {
  const isMobileOS = isMobile.iOS() || isMobile.Android()
  if (isBrowser && isMobileOS) {
    let deferredPrompt = null

    // Check event in Browser
    if (window['BeforeInstallPromptEvent']) {
      window.addEventListener('beforeinstallprompt', function (e) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault()
        // Stash the event so it can be triggered later.
        deferredPrompt = e

        // Show dialog to the add app to home screen
        showInstallPromotion()
      })
    } else {
      window.addEventListener('load', function (e) {
        const isNeedShowInstructions = !JSON.parse(
          localStorageService.get('my_vpn_never_show_instructions')
        )
        if (isNeedShowInstructions) {
          // Show instruction
          showInstallInstruction()
        }
      })
    }

    // Detect to install app
    window.addEventListener('appinstalled', (evt) => {
      localStorageService.set('my_vpn_never_show_instructions', true)
    })

    window.addEventListener('load', async e => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
          .then(function (reg) {
            console.log('Service Worker Registered')

            // Update service worker
            reg.update()

            // updatefound is fired if service-worker.js changes.
            reg.onupdatefound = function () {
              // The updatefound event implies that reg.installing is set; see
              // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
              var installingWorker = reg.installing

              installingWorker.onstatechange = function () {
                switch (installingWorker.state) {
                  case 'installed':
                    if (navigator.serviceWorker.controller) {
                      // At this point, the old content will have been purged and the fresh content will
                      // have been added to the cache.
                      // It's the perfect time to display a "New content is available; please refresh."
                      // message in the page's interface.
                      console.log('New or updated content is available.')
                    } else {
                      // At this point, everything has been precached.
                      // It's the perfect time to display a "Content is cached for offline use." message.
                      console.log('Content is now available offline!')
                    }
                    break

                  case 'redundant':
                    console.error('The installing service worker became redundant.')
                    break
                }
              }
            }
          }).catch(function (e) {
            console.error('Error during service worker registration:', e)
          })
      }
    })

    function addToHomeScreen () {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        deferredPrompt.userChoice
          .then(function (choiceResult) {
            console.log(choiceResult, choiceResult.outcome)
            deferredPrompt = null
          })
      }
    };

    function showInstallPromotion () {
      const pwaPopup = document.querySelector('.pwa-popup')
      if (pwaPopup) {
        pwaPopup.classList.add('pwa-popup--visible')
        document.getElementById('pwa_ok').addEventListener('click', addToHomeScreen)
      }
    };

    function showInstallInstruction () {
      const pwaInstruction = document.querySelector('.pwa-instruction')
      if (pwaInstruction) {
        pwaInstruction.classList.add('pwa-instruction--visible')
      }
    }
  }
}

export default swLauncher

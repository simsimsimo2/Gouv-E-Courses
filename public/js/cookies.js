let boutonCookie = document.getElementById('cookie-consent-banner__cta');
let messageCookie = document.getElementById('cookie-consent-banner');

/**
 * Affichage du cookie en baniere
 */
if(boutonCookie){
    boutonCookie.addEventListener('click', async () => {
        let response = await fetch('/cookies', {
            method: 'POST'
        });
        
        if(response.ok) {
            messageCookie.remove();
        }
    });
}
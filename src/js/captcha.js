// NOTE: Required by google if we hide the reCaptchaBadge

// This site is protected by reCAPTCHA and the Google
//     <a href="https://policies.google.com/privacy">Privacy Policy</a> and
//     <a href="https://policies.google.com/terms">Terms of Service</a> apply.

class Captcha {
  constructor(reCaptchaKey) {
    this.reCaptchaKey = reCaptchaKey;
  }

  hideCaptchaBadge() {
    const cssRules = '.grecaptcha-badge { visibility: hidden; }';

    const styleElement = document.createElement('style');

    styleElement.appendChild(document.createTextNode(cssRules));

    document.getElementsByTagName('head')[0].appendChild(styleElement);
  }

  async captchaFunction() {
    if (!Captcha.privateCaptcha) {
      this.hideCaptchaBadge();

      const getCaptchaFunction = new Promise((resolve, reject) => {
        const scriptId = 'google-recaptcha-v3';
        const googleRecaptchaSrc = 'https://www.google.com/recaptcha/api.js';

        // script already installed, just return
        if (document.getElementById(scriptId)) {
          return;
        }

        const head = document.getElementsByTagName('head')[0];
        const js = document.createElement('script');

        js.id = scriptId;
        js.src = `${googleRecaptchaSrc}?render=${this.reCaptchaKey}`;

        js.onload = () => {
          if (!window || !window.grecaptcha) {
            reject(new Error('Google recaptcha is not available'));
          }

          window.grecaptcha.ready(() => {
            resolve(window.grecaptcha);
          });
        };

        head.appendChild(js);
      });

      try {
        Captcha.privateCaptcha = await getCaptchaFunction;
      } catch (error) {
        console.log(error);
      }
    }

    return Captcha.privateCaptcha;
  }

  // public function
  async call(action, callback = null) {
    // get the google captcha function, async since it has to load the first time
    const captcha = await this.captchaFunction();

    if (captcha) {
      captcha.execute(this.reCaptchaKey, { action }).then((token) => {
        if (callback) {
          callback(token);
        }
      });
    }
  }
}

export default Captcha;

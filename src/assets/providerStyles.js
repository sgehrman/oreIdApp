// logo images for buttons
import oreidLogo from './logos/logo-oreid.svg';
import emailLogo from './logos/logo-email.svg';
import eosLogo from './logos/logo-eos.svg';
import facebookLogo from './logos/logo-facebook.svg';
import githubLogo from './logos/logo-github.svg';
import googleLogo from './logos/logo-google.svg';
import kakaoLogo from './logos/logo-kakao.svg';
import lineLogo from './logos/logo-line.svg';
import linkedinLogo from './logos/logo-linkedin.svg';
import phoneLogo from './logos/logo-phone.svg';
import twitchLogo from './logos/logo-twitch.svg';
import twitterLogo from './logos/logo-twitter.svg';
import wechatLogo from './logos/logo-wechat.svg';

const validProviders = [
  'oreid',
  'scatter',
  'facebook',
  'github',
  'google',
  'kakao',
  'line',
  'linkedin',
  'twitch',
  'twitter',
  'wechat',
  'ledger',
  'lynx',
  'meetone',
  'tokenpocket',
  'email',
  'phone',
  'simpleos'
];

const buttonStyles = {
  email: {
    buttonStyle: {
      backgroundColor: 'white',
      color: 'black'
    },
    logoStyle: {},
    text: 'Log in with Email'
  },
  facebook: {
    buttonStyle: {
      backgroundColor: '#3E5895'
    },
    logoStyle: {},
    text: 'Log in with Facebook'
  },
  github: {
    buttonStyle: {
      backgroundColor: '#222222'
    },
    logoStyle: {},
    text: 'Log in with Github'
  },
  google: {
    buttonStyle: {
      color: '#222',
      backgroundColor: '#fff'
    },
    logoStyle: {},
    text: 'Log in with Google'
  },
  kakao: {
    buttonStyle: {
      color: '#3C1F1E',
      backgroundColor: '#FFEB00'
    },
    logoStyle: {},
    text: 'Log in with Kakao'
  },
  ledger: {
    buttonStyle: {
      backgroundColor: '#39C5AB'
    },
    logoStyle: {
    },
    text: 'Sign with Ledger'
  },
  line: {
    buttonStyle: {
      backgroundColor: '#00C300'
    },
    logoStyle: {},
    text: 'Log in with Line'
  },
  linkedin: {
    buttonStyle: {
      backgroundColor: '#127cb4'
    },
    logoStyle: {},
    text: 'Log in with LinkedIn'
  },
  lynx: {
    buttonStyle: {
      backgroundColor: '#C95A75'
    },
    logoStyle: {
      width: 30,
      height: 30
    },
    text: 'Sign with Lynx'
  },
  meetone: {
    buttonStyle: {
      backgroundColor: '#808080'
    },
    logoStyle: {
    },
    text: 'Sign with MeetOne'
  },
  oreid: {
    buttonStyle: {
      color: '#222',
      backgroundColor: '#ffffff'
    },
    logoStyle: {},
    text: 'Log in with ORE ID'
  },
  phone: {
    buttonStyle: {
      backgroundColor: 'white',
      color: 'black'
    },
    logoStyle: {},
    text: 'Log in with Phone'
  },
  scatter: {
    buttonStyle: {
      backgroundColor: '#7ECEF9'
    },
    logoStyle: {
    },
    text: 'Log in with Scatter'
  },
  tokenpocket: {
    buttonStyle: {
      backgroundColor: '#2C8FF0'
    },
    logoStyle: {
    },
    text: 'Sign with TokenPocket'
  },
  twitch: {
    buttonStyle: {
      backgroundColor: '#6441A4'
    },
    logoStyle: {},
    text: 'Log in with Twitch'
  },
  twitter: {
    buttonStyle: {
      backgroundColor: '#55acee'
    },
    logoStyle: {},
    text: 'Log in with Twitter'
  },
  wechat: {
    buttonStyle: {
      backgroundColor: '#00B70C'
    },
    logoStyle: {},
    text: 'Log in with WeChat'
  }
};

const logoMap = {
  oreid: oreidLogo,
  email: emailLogo,
  eos: eosLogo,
  facebook: facebookLogo,
  github: githubLogo,
  google: googleLogo,
  kakao: kakaoLogo,
  line: lineLogo,
  linkedin: linkedinLogo,
  phone: phoneLogo,
  twitch: twitchLogo,
  twitter: twitterLogo,
  wechat: wechatLogo
};

const defaultButtonStyle = {
  color: '#ffffff',
  width: 250,
  marginTop: '20px'
};

const defaultLogoStyle = {
  width: '20px',
  height: 'auto',
  marginLeft: '10px',
  marginRight: '10px'
};

class ProviderStyles {
  isProviderValid(provider) {
    // warn in console if provider isn't known
    if (!validProviders.includes(provider)) {
      console.log(
        `${provider} is not one of the supported providers. Use one of the following: ${validProviders.join(', ')}`,
      );

      return false;
    }

    return true;
  }

  logoForProvider(provider) {
    let result = logoMap[provider];

    if (!result) {
      result = logoMap.eos;
    }

    return result;
  }

  styleForProvider(provider, textPrefix = '') {
    let result = buttonStyles[provider];

    if (!result) {
      result = buttonStyles.oreid;
      result.text = `${textPrefix} ${provider}`;
    }

    result.buttonStyle = {
      ...defaultButtonStyle,
      ...result.buttonStyle
    };

    result.logoStyle = {
      ...defaultLogoStyle,
      ...result.logoStyle
    };

    return result;
  }
}

const instance = new ProviderStyles();
export default instance;

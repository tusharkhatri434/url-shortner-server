const UAParser = require('ua-parser-js');

const parseUserAgent = (userAgentString) => {
  const parser = new UAParser(userAgentString);
  const device = parser.getDevice();     // { type: 'mobile' | 'tablet' | 'desktop' | undefined, ... }
  const os = parser.getOS();             // { name: 'iOS', version: '13.3' }
  const browser = parser.getBrowser();   // { name: 'Chrome', version: '112.0.0.0' }

  const deviceType = device.type || 'Desktop'; // fallback to Desktop if undefined

  return {
    deviceType,
    os,
    browser,
    raw: {
      device,
      os,
      browser
    }
  };
};

module.exports = parseUserAgent;

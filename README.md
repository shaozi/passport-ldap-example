# An Example to use ldap-authentication as a Passport Strategy

This example uses [ldap-authtication](https://github.com/shaozi/ldap-authentication) to create a Passport LDAP authentication strategy.

## Installation

1. `npm install`

## Work flow

1. `node index.js` to start the server
1. Launch browser and goto `http://localhost:4000`
1. Login as prompted
1. Try different username and password

## How does it work

This example uses [ldap-authtication](https://github.com/shaozi/ldap-authentication) and put it in [passport-custom](https://github.com/mbell8903/passport-custom/blob/master/test/strategy.test.js) to create
a complete Passport strategy.

The LDAP server is hosted at [forumsys](https://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/) and it has a few simple
users to test with.

The information of the LDAP server is saved in `config.js` file.

[ldap-authtication](https://github.com/shaozi/ldap-authentication) takes
the username and password from the submitted form, with the ldap configurations from `config.js` file, it then constructs an option object:

```javascript
const CONFIG = require('./config.js')
// ...
let ldapBaseDn = CONFIG.ldap.dn
let options = {
  ldapOpts: {
    url: CONFIG.ldap.url
  },
  userDn: `uid=${req.body.username},${ldapBaseDn}`,
  userPassword: req.body.password,
  userSearchBase: ldapBaseDn,
  usernameAttribute: 'uid'
}
```

then it calls `let user = await authenticate(options)` to authenticate and
retrieve user from the LDAP server.

I encourage you to check the `index.js` file for details.
Clone this repo and play with it yourself!

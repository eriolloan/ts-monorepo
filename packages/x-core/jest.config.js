// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharedConfig = require('../../.jest.config.json')

module.exports = {
    ...sharedConfig,
    rootDir: './',
}

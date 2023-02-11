import { main } from './main.js'

describe('main', () => {
    it('should exist', async () => {
        const actual = await main()

        expect(actual).toBeDefined()
    })
})

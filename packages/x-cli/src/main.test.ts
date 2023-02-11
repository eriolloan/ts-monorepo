import { main } from '@libs/x-cli'

describe('main', () => {
    it('should exist', async () => {
        const actual = await main()

        expect(actual).toBeDefined()
    })
})

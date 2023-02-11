import { main } from '@libs/x-cli/src/main'

main()
    .then(out => {
        console.log(out)
        process.exit(0)
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })

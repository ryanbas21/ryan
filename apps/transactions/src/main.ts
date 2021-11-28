import { coinbaseHttpRequest } from '@ryan/coinbase-request';

async function main() {
    const a = await coinbaseHttpRequest('user')
    console.log(a);
}

main();
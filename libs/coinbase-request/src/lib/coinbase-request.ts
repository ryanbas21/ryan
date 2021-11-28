import { Fetcher } from 'fetcher-ts';
import { chain, map } from 'fp-ts/es6/TaskEither';
import { fold } from 'fp-ts/es6/Either';
import { flow } from 'fp-ts/es6/function';
import { signRequest } from '@ryan/sign-request';
import { coinbaseEnv } from '@ryan/env';

type CoinbaseResponse =
  | { code: 200, payload: Record<string, unknown> }

function coinbaseHttp(route: string, init?: RequestInit) {
  return new Fetcher<CoinbaseResponse, Record<string, unknown>>('https://api.coinbase.com/v2/' + route, init)
    .handle(200, (data) => data)
    .discardRest(() => ({}))
    .toTaskEither();
}

const key = fold<unknown, NodeJS.ProcessEnv, string>(
                  () => '',
                  obj => obj.COINBASE_API_KEY, 
                )(coinbaseEnv.decode(process.env))

interface ServerTime {
  data: {
    epoch: number;
    iso: string;
  }
}
type ServerTimeResponses = 
  | { code: 200, payload: ServerTime }

function makeServerTimeRequest(payload: Record<string, unknown>) {
  return new Fetcher<ServerTimeResponses, { timestamp: string }>('https://api.coinbase.com/v2/time')
    .handle(200, ({ data }) => ({ ...payload, timestamp: String(data.epoch) }))
    .discardRest(() => ({ timestamp: '' }))
    .toTaskEither()
}

const coinbaseHttpRequest = (payload) => flow(
  payload,
  makeServerTimeRequest,
  map(([obj]) => ({ ...obj, signature: signRequest(obj) })),
  chain(({ signature, timestamp }) => coinbaseHttp('route', { 
    headers: new Headers({
    'CB-ACCESS-KEY': key,     
    'CB-ACCESS-TIMESTAMP': timestamp,
    'CB-ACCESS-SIGN': signature
    })
  })
))()

export { coinbaseHttpRequest };
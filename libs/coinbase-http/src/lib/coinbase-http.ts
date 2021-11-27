import { env } from '@ryan/env';
import { Fetcher } from 'fetcher-ts';
import { tryCatch } from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import { secret, signRequest } from './signing';

interface CoinbaseResults<R> { 
  code: number,
  payload: R 
}; 

function coinbaseHttp<R>(route: string, init?: RequestInit): Fetcher<CoinbaseResults<R>, string> {
  return new Fetcher<CoinbaseResults<R>, string>('https://api.coinbase.com/v2/' + route, init)
    .handle(200, () => '')
    .handle(302, () => '')
    .handle()
}

const headers = { 'X-BINANCE-API-KEY':  secret }
const coinbaseHttpRequest = (payload: any) => flow(
  payload,
  signRequest,
  tryCatch(
    () => coinbaseHttp('route', { headers: new Headers(headers) }),
    err => new Error(err)
  ),

);
export { coinbaseHttpRequest };
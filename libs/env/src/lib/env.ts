import { config } from 'dotenv';
import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as D from 'io-ts/Decoder';

config();

const printDecodingResult = E.fold(flow(D.draw, console.log), console.log);

const intFromString: D.Decoder<string, number> = {
  decode: (s) =>
    pipe(Number.parseInt(s, 10), (n) =>
      Number.isNaN(n) ? D.failure(n, 'Not a number') : D.success(n)
    ),
};

interface CoinbaseEnv {
  COINBASE_API_KEY: string;
  COINBASE_SECRET: string;
}
const env = D.struct<CoinbaseEnv>({
  COINBASE_API_KEY: D.string,
  COINBASE_SECRET: D.string,
});

export { env, CoinbaseEnv };

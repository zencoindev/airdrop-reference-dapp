import { generateApi } from "swagger-typescript-api";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

generateApi({
    url: 'https://raw.githubusercontent.com/tonkeeper/airdrop-api/refs/heads/main/api/swagger.yaml',
    output: path.resolve(__dirname, '../src/api'),
    name: 'claimAPI',
    extractRequestParams: true,
    apiClassName: 'ClaimAPI',
    moduleNameIndex: 1,
    extractEnums: true,
    singleHttpClient: true,
    unwrapResponseData: true,
});

import {DBConnectionSpec, specToConnection} from "@/state/connections-database/configs";
import {DuckDBOverHttpConfig} from "@/state/connections-database/duckdb-over-http";
import {DatabaseConnection} from "@/model/database-connection";


function XorDecrypt(key: string, data: string) {
    let result = '';
    for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

function parseConnectionParams(urlParams: URLSearchParams): DBConnectionSpec | undefined {
    // first get the "api" parameter
    if (!urlParams.has('api')) {
        console.error('No API parameter found');
        return undefined;
    }

    const api = urlParams.get('api');

    switch (api) {
        case 'http':
            // get the "path" parameter
            const url = urlParams.get('url');

            if (!url) {
                console.error('No URL parameter found, but required for HTTP API');
                return undefined;
            }

            // optional: k for api key
            let key = undefined;
            let authentication: 'none' | 'token' = 'none';
            const enc_ey = urlParams.get('k');
            if (enc_ey) {
                key = XorDecrypt('DuckDB', enc_ey);
                authentication = 'token';
            }

            const httpconfig: DuckDBOverHttpConfig = {
                name: 'DuckDB',
                url: url,
                useToken: authentication === 'token',
                token: key
            }

            return {
                type: 'duckdb-over-http',
                config: httpconfig
            }

        default:
            console.error('Unknown API:', api);
            return undefined;
    }
}

export async function getConnectionFromParams(urlParams: URLSearchParams): Promise<DatabaseConnection | undefined> {
    const connectionSpec = parseConnectionParams(urlParams);
    if (!connectionSpec) {
        return undefined;
    }

    const connection = specToConnection(connectionSpec);
    const state = await connection.checkConnectionState();
    if (state.state === 'connected') {
        return connection;
    }

    return undefined;
}


export async function getConnectionFromHistory(history: DBConnectionSpec[]): Promise<DatabaseConnection | undefined> {

    if (history.length === 0) {
        return undefined;
    }

    for (let i = history.length - 1; i >= 0; i--) {
        const connection = specToConnection(history[i]);
        const state = await connection.checkConnectionState();
        if (state.state === 'connected') {
            return connection;
        }
    }

    return undefined;
}

export async function getConnection(urlParams: URLSearchParams, history: DBConnectionSpec[]): Promise<DatabaseConnection | undefined> {
    const connection = await getConnectionFromParams(urlParams);
    if (connection) {
        return connection;
    }

    return await getConnectionFromHistory(history);
}

export function tryToFindWorkingConnection(history: DBConnectionSpec[]): Promise<DatabaseConnection | undefined> {
    return getConnectionFromHistory(history);
}
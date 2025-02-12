import {RelationData} from "@/model/relation";

export type DatabaseConnectionType = 'duckdb-over-http' | 'duckdb-wasm' | 'duckdb-wasm-motherduck';

export interface ConnectionStatus {
    state: 'connected' | 'disconnected' | 'connecting' | 'error';
    message?: string;
}

export type DataConnectionConfig = { [key: string]: string | number | boolean | undefined };

//! A DatabaseConnection manages the connection to a database. Only one DatabaseConnection can be active at a time.
//! DatabaseConnection can be e.g. LocalDuckdb, DuckDBWasm, but in the future maybe also Postgres, MySQL, etc.
export interface DatabaseConnection {
    id: string;

    config: DataConnectionConfig

    type: DatabaseConnectionType;
    connectionStatus: ConnectionStatus;

    executeQuery: (query: string) => Promise<RelationData>;
    initialise: () => Promise<ConnectionStatus>;
    checkConnectionState: () => Promise<ConnectionStatus>;

    updateConfig: (config: Partial<DataConnectionConfig>) => void;
}
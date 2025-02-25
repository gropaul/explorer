import {RelationData} from "@/model/relation";
import {SOURCE_CONNECTION_ID_DUCKDB_INTERNAL_DATABASES} from "@/platform/global-data";
import {ConnectionsService} from "@/state/connections-service";
import {DataSource, DataSourceConnection, DataSourceConnectionType} from "@/model/data-source-connection";
import {loadDuckDBDataSources, onDuckDBDataSourceClick} from "@/state/connections-source/duckdb-helper";
import {ConnectionStatus} from "@/model/database-connection";

export async function getDuckDBInternalDatabase(): Promise<DataSourceConnection> {
    return new DuckdbInternalDatabases(SOURCE_CONNECTION_ID_DUCKDB_INTERNAL_DATABASES, {
        name: 'DuckDB',
    });
}

interface DuckdbInternalDatabasesConfig {
    name: string;

    [key: string]: string | number | boolean | undefined;
}

export class DuckdbInternalDatabases implements DataSourceConnection {
    config: DuckdbInternalDatabasesConfig;
    id: string;
    type: DataSourceConnectionType = 'duckdb-internal-databases';
    connectionStatus: ConnectionStatus = {state: 'disconnected', message: 'ConnectionState not initialised'};
    dataSources: DataSource[] = [];

    constructor(id: string, config: DuckdbInternalDatabasesConfig) {
        this.id = id;
        this.config = config;
    }

    executeQuery(query: string): Promise<RelationData> {
        return ConnectionsService.getInstance().executeQuery(query);
    }

    async checkConnectionState(): Promise<ConnectionStatus> {
        this.connectionStatus = await ConnectionsService.getInstance().getDatabaseConnectionState();
        return this.connectionStatus;
    }

    async initialise(): Promise<ConnectionStatus> {
        return this.checkConnectionState();
    }

    async loadDataSources(): Promise<DataSource[]> {
        return loadDuckDBDataSources((query) => this.executeQuery(query));
    }

    async onDataSourceClick(id_path: string[]) {
        await onDuckDBDataSourceClick(this, id_path, this.dataSources);
    }

    loadChildrenForDataSource(_id_path: string[]): Promise<DataSource[]> {
        // not necessary as for dbs all the data is loaded at once!
        console.error('loadChildrenForDataSource not implemented for DuckDBOverHttp');
        return Promise.resolve([]);
    }

    async updateConfig(config: Partial<DuckdbInternalDatabasesConfig>): Promise<void> {
        this.config = {...this.config, ...config};
    }

    // dataSourceContextMenuFactory = (tree_id_path: string[], tree: TreeNode): ReactNode => {
    //     // todo: implement
    // }

}


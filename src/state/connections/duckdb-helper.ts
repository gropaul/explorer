import {DataConnection, DataSource, DataSourceElement, DataSourceGroup} from "@/state/connections.state";
import {duckDBTypeToValueType} from "@/model/value-type";
import { RelationData} from "@/model/relation";
import {useRelationsState} from "@/state/relations.state";




export async function onDuckDBDataSourceClick(connection: DataConnection, id_path: string[]) {

    const showRelation = useRelationsState.getState().showRelationByName;

    // if path has two elements, it’s a data source
    if (id_path.length === 3) {
        const [databaseName, schemaName, relationName] = id_path;
        await showRelation(connection.id, databaseName, schemaName, relationName);
    }
}

export async function loadDuckDBDataSources(executeQuery: (query: string) => Promise<RelationData>): Promise<DataSource[]> {
// get all columns and tables

    const query = `SELECT table_catalog, table_schema, table_name, column_name, data_type
                       FROM information_schema.columns
                       ORDER BY table_catalog, table_name, ordinal_position;`;

    const rows = await executeQuery(query);
    // will have format [database_name: table_schema: table_name: {column_name, data_type}]
    const map: any = {}

    for (const row of rows.rows) {
        const [database, table_schema, table_name, column_name, type] = row;
        if (!map[database]) {
            map[database] = {};
        }
        if (!map[database][table_schema]) {
            map[database][table_schema] = {};
        }

        if (!map[database][table_schema][table_name]) {
            map[database][table_schema][table_name] = [];
        }

        map[database][table_schema][table_name].push([column_name, type]);
    }

    let localDataSources: DataSource[] = [];

    for (const database in map) {
        const database_schemas: DataSourceGroup[] = [];
        for (const table_schema in map[database]) {
            const schema_tables: DataSourceElement[] = [];
            for (const table in map[database][table_schema]) {
                const columns = map[database][table_schema][table];

                // add relation to schema
                schema_tables.push({
                    type: 'relation',
                    name: table,
                    children: columns.map(([column, type]: [string, string]) => {
                        return {
                            name: column,
                            type: duckDBTypeToValueType(type)
                        };
                    })
                });
            }

            // add schema to database
            database_schemas.push({
                type: 'schema',
                name: table_schema,
                children: schema_tables,
                childrenLoaded: true
            });
        }

        // add database to data sources
        localDataSources.push({
            type: 'database',
            name: database,
            children: database_schemas,
            childrenLoaded: true
        });
    }
    return localDataSources;
}
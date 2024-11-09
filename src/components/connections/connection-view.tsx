import {TreeExplorer} from "@/components/basics/tree-explorer/tree-explorer";
import {defaultIconFactory} from "@/components/basics/tree-explorer/icon-factories";
import React from "react";
import {DataConnection, DataConnectionConfig, useConnectionsState} from "@/state/connections.state";
import {useRelationsState} from "@/state/relations.state";
import {RefreshCw, Settings} from "lucide-react";
import ConnectionConfigModel from "@/components/connections/connection-config-modal";

export interface ConnectionViewProps {
    connection: DataConnection;
}

export function ConnectionView(props: ConnectionViewProps) {

    const showRelation = useRelationsState((state) => state.showRelation);
    const updateDataSources = useConnectionsState((state) => state.updateDataSources);
    const updateConfig = useConnectionsState((state) => state.updateConfig);
    const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);

    async function onElementClick(connection: DataConnection, id_path: string[]) {
        // if path has two elements, it’s a data source
        if (id_path.length === 2) {
            const [databaseName, relationName] = id_path;
            await showRelation(connection.id, databaseName, relationName);
        }
    }

    function handleRefresh() {
        updateDataSources(props.connection.id);
        console.log('Refreshing data sources');
    }

    function onSettingsIconClicked() {
        setSettingsModalOpen(!settingsModalOpen);
    }

    function closeModal() {
        setSettingsModalOpen(false);
    }

    function saveSettings(newConfig: DataConnectionConfig) {
        updateConfig(props.connection.id, newConfig);
        setSettingsModalOpen(false);
    }

    return (
        <li className="p-2 text-s border-b border-gray-200 dark:border-gray-700 h-fit relative group">
            <div className="flex items-center justify-between">
                <span>{props.connection.config.name}</span>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleRefresh}
                            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                        <RefreshCw size={16}/>
                    </button>
                    <button onClick={onSettingsIconClicked}
                            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                        <Settings size={16}/>
                    </button>
                </div>
            </div>
            <TreeExplorer
                tree={props.connection.dataSources}
                iconFactory={defaultIconFactory}
                onClick={(id_path) => onElementClick(props.connection, id_path)}
            />

            <ConnectionConfigModel
                isOpen={settingsModalOpen}
                onClose={closeModal}
                onSave={saveSettings}
                connection={props.connection}
            />
        </li>
    );
}

import {getDefaultQueryParams, getQueryFromParamsUnchecked} from "@/model/relation-state";
import {getInitialTabViewBaseState, getInitViewState, TabViewBaseState} from "@/model/relation-view-state";
import {Relation, RelationSourceQuery} from "@/model/relation";
import {getRandomId} from "@/platform/id-utils";
import {CONNECTION_ID_DUCKDB_LOCAL} from "@/platform/global-data";
import EditorJS, {OutputData} from "@editorjs/editorjs";
import {MutableRefObject} from "react";
import {RelationBlockData} from "@/components/editor/tools/relation.tool";

export interface DashboardViewState extends TabViewBaseState {

}

export function getInitDashboardViewState(displayName: string): DashboardViewState {
    return {
        ...getInitialTabViewBaseState(displayName),
    };
}

export interface DashboardState {
    id: string;
    name: string;
    editorRef: MutableRefObject<EditorJS | null>;
    elementState?: OutputData;
    viewState: DashboardViewState;
}

export function getInitialDataElement(): RelationBlockData {

    const randomId = getRandomId();
    const baseQuery = "SELECT 'Hello, World! 🦆' AS message;";
    const source: RelationSourceQuery = {
        type: "query",
        baseQuery: baseQuery,
        id: randomId,
        name: "New Query"
    }
    const defaultQueryParams = getDefaultQueryParams();
    const relation: Relation = {
        connectionId: CONNECTION_ID_DUCKDB_LOCAL, id: randomId, name: "New Query", source: source
    }
    const query = getQueryFromParamsUnchecked(relation, defaultQueryParams, baseQuery)
    return {
        ...relation,
        query: query,
        viewState: getInitViewState(
            'New Data Element',
            undefined,
            true
        ),
        executionState: {
            state: "not-started"
        }

    };
}
import {getRelationIdFromSource, Relation, RelationSource} from "@/model/relation";
import {create} from "zustand";
import {Model} from "flexlayout-react";
import {
    addRelationToLayout,
    addSchemaToLayout,
    focusTabById,
    getInitialLayoutModel
} from "@/state/relations/layout-updates";
import {
    executeQueryOfRelationState,
    getDefaultQueryParams,
    getViewFromSource,
    RelationQueryParams,
    RelationState,
    updateRelationForNewParams,
} from "@/model/relation-state";
import {RelationViewState} from "@/model/relation-view-state";
import {DataSourceGroup} from "@/model/connection";
import {getSchemaId, SchemaState} from "@/model/schema-state";


interface RelationStates {

    relations: { [key: string]: RelationState };
    schemas: { [key: string]: SchemaState };

    doesRelationExist: (relationId: string) => boolean,
    getRelation: (relationId: string) => RelationState,
    closeRelation: (relationId: string) => void,

    showRelationFromSource: (connectionId: string, source: RelationSource) => Promise<void>,

    updateRelationData: (relationId: string, query: RelationQueryParams) => Promise<void>,

    setRelationViewState: (relationId: string, viewState: RelationViewState) => void,
    getRelationViewState: (relationId: string) => RelationViewState,
    updateRelationViewState: (relationId: string, viewState: Partial<RelationViewState>) => void,

    showSchema: (connectionId: string, databaseId: string, schema: DataSourceGroup) => Promise<void>,
    getSchemaState: (schemaId: string) => SchemaState,

    layoutModel: Model;
    getModel: () => Model;
    setModel: (model: Model) => void;
}

export const useRelationsState = create<RelationStates>((set, get) => ({
    relations: {},
    schemas: {},
    selectedRelationsIndex: undefined,

    showSchema: async (connectionId: string, databaseId: string, schema: DataSourceGroup) => {
        const {schemas} = get(); // Get the current state
        const schemaId = getSchemaId(connectionId, databaseId, schema); // Generate the schema ID
        const existingSchema = schemas[schemaId]; // Retrieve the schema
        if (existingSchema) {
            focusTabById(get().layoutModel, schemaId);
        } else {
            set((state) => ({
                schemas: {
                    ...state.schemas,
                    [schemaId]: {
                        ...schema,
                        connectionId,
                        databaseId,
                    }
                },
            }));

            const model = get().layoutModel;
            addSchemaToLayout(model, schemaId, schema);
        }
    },

    getSchemaState: (schemaId: string) => {
        return get().schemas[schemaId];
    },

    doesRelationExist: (relationId: string) => get().relations[relationId] !== undefined,
    getRelation: (relationId: string) => get().relations[relationId],
    showRelationFromSource: async (connectionId: string, source: RelationSource) => {

        const relationId = getRelationIdFromSource(connectionId, source);

        // check if relation already exists
        const existingRelation = get().relations[relationId];
        if (existingRelation) {
            focusTabById(get().layoutModel, existingRelation.id);
        } else {

            // update state with empty (loading) relation
            const defaultQueryParams = getDefaultQueryParams();
            const emptyRelationState = getViewFromSource(connectionId, source, defaultQueryParams, 'running');
            set((state) => ({
                relations: {
                    ...state.relations,
                    [relationId]: emptyRelationState,
                },
            }));

            const model = get().layoutModel;
            addRelationToLayout(model, emptyRelationState);

            // execute query
            const executedRelationState = await executeQueryOfRelationState(emptyRelationState);
            set((state) => ({
                relations: {
                    ...state.relations,
                    [relationId]: executedRelationState,
                },
            }));
        }
    },

    updateRelationData: async (relationId, query) => {
        const {relations} = get(); // Get the current state

        const relation = relations[relationId]; // Retrieve the specific relation
        const updatedRelationState = updateRelationForNewParams(relation, query, 'running'); // Update the relation state
        set((state) => ({
            relations: {
                ...state.relations,
                [relationId]: updatedRelationState,
            },
        }));
        const executedRelationState = await executeQueryOfRelationState(updatedRelationState);
        set((state) => ({
            relations: {
                ...state.relations,
                [relationId]: executedRelationState,
            },
        }));
    },

    setRelationViewState: (relationId: string, viewState: RelationViewState) => {
        set((state) => ({
            relations: {
                ...state.relations,
                [relationId]: {
                    ...state.relations[relationId],
                    viewState,
                },
            }
        }));
    },

    getRelationViewState: (relationId: string) => {
        return get().relations[relationId].viewState;
    },
    updateRelationViewState: (relationId: string, viewState: Partial<RelationViewState>) => {
        set((state) => ({
            relations: {
                ...state.relations,
                [relationId]: {
                    ...state.relations[relationId],
                    viewState: {
                        ...state.relations[relationId].viewState,
                        ...viewState,
                    },
                },
            },
        }));
    },
    closeRelation: (relationId: string) => {
        const {relations} = get(); // Get the current state
        delete relations[relationId]; // Remove the specified relation
        set({relations}); // Update the state
    },

    getModel: () => get().layoutModel,
    setModel: (model: Model) =>
        set(() => ({
                layoutModel: model,
            }),
        ),

    layoutModel: getInitialLayoutModel({relations: []}),
}));

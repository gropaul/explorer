import {useRelationsState} from "@/state/relations.state";
import {RelationViewContent} from "@/components/relation/relation-view-content";
import {RelationViewHeader} from "@/components/relation/relation-view-header";
import {shallow} from "zustand/shallow";
import {RelationState, TaskExecutionState} from "@/model/relation-state";
import {JsonViewer} from "@/components/ui/json-viewer";
import {RelationStateView} from "@/components/relation/relation-state-view";
import {TriangleAlert} from "lucide-react";
import {DeepPartial} from "@/platform/utils";
import {RelationViewState} from "@/model/relation-view-state";

export interface RelationViewProps {
    relationState: RelationState;
    updateRelationViewState: (relationId: string, viewState: DeepPartial<RelationViewState>) => void,
}

export function RelationView(props: RelationViewProps) {
    return (
        <div className="w-full h-full flex flex-col p-0 m-0 bg-background">
            {/* Header */}
            <RelationViewHeader relationState={props.relationState} updateRelationViewState={props.updateRelationViewState}/>

            {/* Content */}
            <div className={`flex-1 overflow-auto relative`}>
                <RelationStateView relationState={props.relationState} />
            </div>
        </div>
    );
}

export interface ContentWrapperProps {
    isLoading: boolean;
    relationId: string;
    queryState: TaskExecutionState;
}

export function ContentWrapper(props: ContentWrapperProps) {
    return (
        props.queryState.state === "error" ? (
            <RelationViewError error={props.queryState.error}/>
        ) : (
            <RelationViewContent relationId={props.relationId}/>
        )
    );
}

export function RelationViewError({error}: { error: Record<string, any> }) {
    return (
        <div className="p-4 w-full h-full flex flex-col items-start justify-start">
            <div className={'flex flex-row text-red-500 items-center space-x-2 h-6'}>
                <TriangleAlert size={16}/>
                <span>Error executing query</span>
            </div>
            <JsonViewer className="w-full text-red-500" json={error}/>
        </div>
    );
}

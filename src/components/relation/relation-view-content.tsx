import {Table} from "@/components/relation/table/table";
import {RelationViewType} from "@/model/relation-view-state";
import {useRelationsState} from "@/state/relations.state";
import {shallow} from "zustand/shallow";


export interface RelationViewContentProps {
    relationId: string;
}

export function RelationViewContent({relationId}: RelationViewContentProps) {

    const selectedView = useRelationsState((state) => state.getRelationViewState(relationId).selectedView, shallow);

    if (selectedView === 'table') {
        return (
            <Table relationId={relationId}/>
        );
    }
}
import {BarChart} from "@/components/relation/chart/bar-chart";
import {useRelationsState} from "@/state/relations.state";
import {shallow} from "zustand/shallow";


export interface ChartProps {
    relationId: string;
}

export function Chart(props: ChartProps) {

    const relationState = useRelationsState((state) => state.getRelation(props.relationId), shallow);

    return (
        <BarChart />
    )
}
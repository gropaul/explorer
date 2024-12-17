import {Exportable} from "@/components/relation/chart/exportable";
import {useRelationsState} from "@/state/relations.state";
import {shallow} from "zustand/shallow";
import {ChartContent} from "@/components/relation/chart/chart-content";
import {ChartConfig} from "@/components/relation/chart/rechart/config";
import {toSnakeCase} from "@/platform/string-utils";


export interface ChartProps {
    relationId: string;
}

export function Chart(props: ChartProps) {

    const relationState = useRelationsState((state) => state.getRelation(props.relationId), shallow);

    if (relationState.data === undefined) {
        return null;
    }

    const config: ChartConfig = {
        plot: {
            title: relationState.name,
            type: 'bar',
            xAxis: {
                columnName: relationState.data.columns[0].name,
                label: "X Axis",
                color: "red",
            },
            yAxis: {
                columnName: relationState.data.columns[1].name,
                label: "Y Axis",
                color: "#ffb703",
            }
        }
    }

    return (
        <div className="p-4 w-full h-full overflow-auto">
            <Exportable fileName={toSnakeCase(config.plot.title)}>
                <ChartContent data={relationState.data} config={config} />
            </Exportable>
        </div>
    )
}
import {DefaultRelationZustandActions, useRelationsState} from "@/state/relations.state";
import {CodeFence} from "@/components/basics/code-fence/code-fence";
import {getDefaultQueryParams, RelationState} from "@/model/relation-state";
import {getSeparatedStatements} from "@/platform/sql-utils";
import {cn} from "@/lib/utils";

interface RelationViewQueryProps extends DefaultRelationZustandActions{
    relationState: RelationState,
    embedded?: boolean;
}

export function RelationViewQueryView(props: RelationViewQueryProps) {

    const codeFenceState = props.relationState.viewState.codeFenceState;
    const queryString = props.relationState.query.baseQuery;
    const executionState = props.relationState.executionState;

    const relationId = props.relationState.id;
    async function onRunQuery() {
        // we need to reset the view params as the could be columns removed now that had filters before!
        const oldLimit = props.relationState.query.viewParameters.limit;
        await props.updateRelationDataWithParams(relationId, getDefaultQueryParams(oldLimit));
    }

    function onCodeChange(code: string) {
        props.updateRelationBaseQuery(relationId, code);
    }

    if (!codeFenceState!.show) {
        return null;
    }

    const runQueryIfNotRunning = executionState.state == "running" ? undefined : onRunQuery
    const nQueries = getSeparatedStatements(queryString).length
    const runText = executionState.state == "running" ? "Running..." : `Run (${nQueries} Query${nQueries > 1 ? "s" : ""})`

    const embedded = props.embedded ?? false;
    return (
        <div className={"w-full h-full overflow-hidden"}>
            <CodeFence
                alwaysConsumeMouseWheel={!embedded}
                buttonPosition={'panel'}
                showLineNumbers={true}
                height={'100%'}
                runText={runText}
                language="sql"
                displayCode={queryString}
                showCopyButton={true}
                showRunButton={true}
                readOnly={false}
                onCodeChange={onCodeChange}
                onRun={runQueryIfNotRunning}
                executionState={executionState}
                showLayoutButton={!embedded}
                currentLayout={codeFenceState.layout}
                onLayoutChange={(layout) => {
                    useRelationsState.getState().updateRelationViewState(relationId, {
                        codeFenceState: {
                            layout: layout
                        }
                    });
                }}
            />
        </div>
    );
}
import React from "react";
import {ConnectionsOverview} from "@/components/connections/connections-overview";
import {EditorOverview} from "@/components/editor/editor-overview";
import {Database, Sheet} from "lucide-react";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";

export interface NavigationBarProps {
    initialSelectedTabs?: AvailableTabs[];
    onSelectedTabsChanged?: (selectedTabs: AvailableTabs[]) => void;
}

export type AvailableTabs = 'connections' | 'relations';

export function NavigationBar(props: NavigationBarProps) {
    const [selectedTabs, setSelectedTabs] = React.useState<AvailableTabs[]>(props.initialSelectedTabs || ['connections', 'relations']);

    // Handle tab selection change
    const handleTabChange = (value: string[]) => {
        setSelectedTabs(value as AvailableTabs[]);
        if (props.onSelectedTabsChanged) {
            props.onSelectedTabsChanged(value as AvailableTabs[]);
        }
    };

    return (
        <div className={'w-16 h-full bg-background border-r border-separate flex flex-col items-center'}>

            <Avatar
                className={'mt-2'}
            >
                <AvatarImage src="favicon/web-app-manifest-192x192.png" alt="Logo"/>
            </Avatar>

            <ToggleGroup
                type="multiple"
                className={'flex flex-col mt-4'}
                value={selectedTabs}
                onValueChange={handleTabChange}
            >
                <ToggleGroupItem
                    size={'lg'}
                    className={'mb-2'}
                    value="connections"
                    aria-label="Toggle Connection"
                >
                    <Database className="h-10 w-10"/>
                </ToggleGroupItem>
                <ToggleGroupItem
                    size={'lg'}
                    value="relations"
                    aria-label="Toggle Relations"
                >
                    <Sheet className="h-10 w-10"/>
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}


interface NavigationBarContentProps {
    selectedTabs: AvailableTabs[];
}

export function NavigationBarContent(props: NavigationBarContentProps) {

    function renderTabContent(tab: AvailableTabs) {
        switch (tab) {
            case 'connections':
                return <ConnectionsOverview/>;
            case 'relations':
                return <EditorOverview/>;
        }
    }

    return (
        <div className={'flex-1 h-screen overflow-auto'}>
            <ResizablePanelGroup direction={'vertical'}>
                {props.selectedTabs.toSorted().map((tab, index) => (
                    <>
                        {index > 0 && <ResizableHandle/>}
                        <ResizablePanel
                            style={{overflow: 'auto'}}
                            key={index}
                            defaultSize={50}
                            minSize={20}
                        >
                            {renderTabContent(tab)}
                        </ResizablePanel>

                    </>
                ))}
            </ResizablePanelGroup>
        </div>
    )
}
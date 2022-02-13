import { useEffect, useState } from "react";
import { Randomizer } from "../components/Rendomizer";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { SharedMap } from "fluid-framework";


const client = new TinyliciousClient();

const containerSchema = {
    initialObjects: { mySingeSampleMap: SharedMap }
};

const RandomizerValueKey = "MyValue"

const getSingleRandomizerValue = async (): Promise<SharedMap> => {
    let container;
    const containerId = window.location.hash.substring(1);
    if (!containerId) {
        ({ container } = await client.createContainer(containerSchema));
        (container.initialObjects.mySingeSampleMap as SharedMap).set(RandomizerValueKey, 0);
        const id = await container.attach();
        window.location.hash = id;
    } else {
        ({ container } = await client.getContainer(containerId, containerSchema));
    }
    return container.initialObjects.mySingeSampleMap as SharedMap;
}

export function Sample02SingelRandomizer() {
    const [fluidMap, setFluidMap] = useState<SharedMap | undefined>(undefined);
    useEffect(() => {
        getSingleRandomizerValue().then((mySingeSampleMap: SharedMap) => setFluidMap(mySingeSampleMap));
    }, []);

    const [viewData, setViewData] = useState<number>(0);
    useEffect(() => {
        if (fluidMap !== undefined) {
            // sync Fluid data into view state
            const syncView = () => setViewData(fluidMap.get(RandomizerValueKey) as number);
            // ensure sync runs at least once
            syncView();
            // update state each time our map changes
            fluidMap.on("valueChanged", syncView);
            // turn off listener when component is unmounted
            return () => { fluidMap.off("valueChanged", syncView) }
        }
    }, [fluidMap])

    return (
        <div >
            {!viewData ?
                <div /> :
                <Randomizer value={viewData} onNewNumber={(val) => setViewData(val)} />
            }
        </div>
    );
}
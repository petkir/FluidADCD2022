import { useEffect, useState } from "react";
import { Randomizer } from "../components/Rendomizer";

import { SharedMap } from "fluid-framework";
import { AzureClient } from "@fluidframework/azure-client";
import { connectionConfig } from "../config";


const client = new AzureClient(connectionConfig);

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
            const syncView = () => setViewData(fluidMap.get(RandomizerValueKey) as number);
            syncView();
            fluidMap.on("valueChanged", syncView);
            return () => { fluidMap.off("valueChanged", syncView) }
        }
    }, [fluidMap])

    return (
        <div >
            <h2>Sample 2</h2>
                <Randomizer value={viewData} onNewNumber={(val) => fluidMap?.set(RandomizerValueKey,val)} />
        </div>
    );
}
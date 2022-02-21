import styles from './Multi.module.scss';
import { useEffect, useState } from "react";
import { Randomizer } from "../components/Rendomizer";
import { SharedMap } from "fluid-framework";
import { Slider } from "@fluentui/react";
import { AzureClient } from '@fluidframework/azure-client';
import { connectionConfig } from '../config';


const client = new AzureClient(connectionConfig);

const containerSchema = {
  initialObjects: { mySingeSampleMap: SharedMap }
};

const RandomizerKey = "Value"

const getSingleRandomizerValue = async (): Promise<SharedMap> => {
  let container;
  const containerId = window.location.hash.substring(1);
  if (!containerId) {
    ({ container } = await client.createContainer(containerSchema));
    (container.initialObjects.mySingeSampleMap as SharedMap).set(RandomizerKey, [1]);
    const id = await container.attach();
    window.location.hash = id;
  } else {
    ({ container } = await client.getContainer(containerId, containerSchema));
  }
  return container.initialObjects.mySingeSampleMap as SharedMap;
}

export function Sample04MuliRandomizer() {
  const [fluidMap, setFluidMap] = useState<SharedMap | undefined>(undefined);
  useEffect(() => {
    getSingleRandomizerValue().then((mySingeSampleMap: SharedMap) => setFluidMap(mySingeSampleMap));
  }, []);

  const [viewData, setViewData] = useState<number[]>([]);
  useEffect(() => {
    if (fluidMap !== undefined) {
      const syncView = () => setViewData(fluidMap.get(RandomizerKey) as number[]);
      syncView();
      fluidMap.on("valueChanged", syncView);
      return () => { fluidMap.off("valueChanged", () => { }) }
    }
  }, [fluidMap])
  const setNewValue = (value: number, index: number) => {
    const clone = viewData.slice()
    clone[index] = value
    if (fluidMap) {
      fluidMap.set(RandomizerKey, clone);
    }
  }
  const changeArraySize = (value: number): void => {
    if (fluidMap) {
      if (value < viewData.length) {
        const clone = viewData.slice();
        const count = clone.length - value;
        clone.splice(value - 1, count);
        fluidMap.set(RandomizerKey, clone);
      } else if (value > viewData.length) {
        const count = value - viewData.length;
        const clone = viewData.slice();
        for (let i = 0; i < count; i++) {
          clone.push(1);
        }
        fluidMap.set(RandomizerKey, clone);
      }
    }
  }
  return (
    <div >
      <div className={styles.Multi} >
        <div className={styles.Slider}>
          <h2>Sample 4</h2>
          <div>
              <Slider value={viewData.length} onChange={(value) => {
                changeArraySize(value);
              }} />
            </div>
        </div>
          <div className={styles.MultiRandomizer}>
            {
              viewData.map((v, i) => {
                return (<Randomizer value={v} key={'random' + i} onNewNumber={(val) => setNewValue(val, i)} />);
              })
            }
          </div>
        </div>
    </div>
  );
}
import styles from './Multi.module.scss';
import { useEffect, useRef, useState } from "react";
import { Randomizer } from "../components/Rendomizer";
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { IValueChanged, SharedMap } from "fluid-framework";
import { Slider, values } from "@fluentui/react";


const client = new TinyliciousClient();

const containerSchema = {
  initialObjects: { myMultiSampleMap: SharedMap }
};

const RandomizerKeyPrefix = "Value_"

const getMultiRandomizerValue = async (): Promise<SharedMap> => {
  let container;
  const containerId = window.location.hash.substring(1);
  if (!containerId) {
    ({ container } = await client.createContainer(containerSchema));
    (container.initialObjects.myMultiSampleMap as SharedMap).set(RandomizerKeyPrefix + 0, 1);
    const id = await container.attach();
    window.location.hash = id;
  } else {
    ({ container } = await client.getContainer(containerId, containerSchema));
  }
  return container.initialObjects.myMultiSampleMap as SharedMap;
}

export function Sample05MuliRandomizer() {
  const [fluidMap, setFluidMap] = useState<SharedMap | undefined>(undefined);
  useEffect(() => {
    getMultiRandomizerValue().then((myMultiSampleMap: SharedMap) => setFluidMap(myMultiSampleMap));
  }, []);

  const [viewData, setViewData] = useState<number[]>([1]);
  const dataRef = useRef(viewData);
  useEffect(() => {

    const syncView = (changed: IValueChanged, local: boolean, target: SharedMap, current: number[]): void => {
      if (fluidMap) {

        if (changed.key.indexOf(RandomizerKeyPrefix) === 0) {
          const position = parseInt(changed.key.substring(RandomizerKeyPrefix.length));
          const value = fluidMap.get(changed.key);
          updateStateArray(position, value);
        }
      }
    };
    const initView = (): void => {
      if (fluidMap) {
        const keys = Array.from(fluidMap.keys()).filter((x) => x.startsWith(RandomizerKeyPrefix));
        const array: number[] = [];
        keys.forEach((k) => {
          const value = fluidMap.get(k);
          if (value !== undefined) {
            array.push(value);
          }

        });
        setViewData(array);
        dataRef.current =array;
      }

    }
    initView();
    fluidMap?.on("valueChanged", (c, l, s) => { syncView(c, l, s, viewData); });
    return () => { fluidMap?.off("valueChanged", () => { }) }

  }, [fluidMap,setViewData]);

  const updateStateArray = (position: number, value: number) => {
    const clone = dataRef.current.slice();
    if (value === undefined) {
      clone.splice(position, 1);
    } else {
      if (position >= clone.length) {
        clone.push(value);
      } else {
        clone[position] = value;
      }
    }
    setViewData(clone);
    dataRef.current =clone;
  }
  const setNewValue = (value: number, index: number) => {
    if (fluidMap) {
      fluidMap.set(RandomizerKeyPrefix + index, value);
    }
  }
  const changeArraySize = (value: number): void => {
    if (fluidMap) {
      if (value < viewData.length) {
        const count = viewData.length - value;
        const lastposition = viewData.length - 1;
        for (let i = 0; i < count; i++) {
          //fluidMap.delete(RandomizerKeyPrefix + (lastposition - i));
          //we need a event!!!
          fluidMap.set(RandomizerKeyPrefix + (lastposition - i), undefined);
        }

      } else if (value > viewData.length) {
        const count = value - viewData.length;
        const lastposition = viewData.length;
        for (let i = 0; i < count; i++) {
          fluidMap.set(RandomizerKeyPrefix + (lastposition + i), 1);
        }
      }
    }
  }
  return (
    <div >
      <div className={styles.Multi} >
        <div className={styles.Slider}>
          <h2>Sample 5</h2>
          {viewData === undefined ? <div /> :
            <div>
              <Slider value={viewData.length} onChange={(value) => changeArraySize(value)} />
            </div>
          }
        </div>
        {viewData === undefined ? <div /> :
          <div className={styles.MultiRandomizer}>
            {
              viewData.map((v, i) => {
                return (<Randomizer value={v} key={'rand' + i} onNewNumber={(val) => setNewValue(val, i)} />);
              })
            }
          </div>
        }

      </div>
    </div >
  );
}
import {
  ControlContextService,
  DatasetChangedEventArgs,
  PCFControlContextService,
} from "pcf-react";
import { useContext, useEffect, useState } from "react";
import ControlContext from "./ControlContext";

const useControlContext = () => {
  const context = useContext(ControlContext);
  const [service, setService] = useState<PCFControlContextService>();
  useEffect(() => {
    if (!!context) {
      setService(context);
    }
  }, [context]);

  return service;
};

type EntityRecord = ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;

const useEntityRecords = () => {
  const [dataSet, setDataSet] = useState<EntityRecord[]>();
  const service = useControlContext();

  const onDataChanged = (
    sender: ControlContextService,
    ev: DatasetChangedEventArgs
  ) => setDataSet(ev.data);

  useEffect(() => {
    if (!!service) {
      service.onDataChangedEvent.subscribe(onDataChanged);
      service.refreshDataset();
    }
  }, [service]);

  return dataSet;
};

function useParameters<T>(): T | undefined {
  const [parameters, setParameters] = useState<T>();
  const service = useControlContext();

  useEffect(() => {
    if (!!service) {
      const parameters = service.getParameters<T>();
      setParameters(parameters);
    }
  }, [service]);

  return parameters;
}

export * from "./BaseControlComponentProps";
export { ControlContext, useParameters, useControlContext, useEntityRecords };

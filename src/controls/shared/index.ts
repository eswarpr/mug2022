import { PCFControlContextService } from "pcf-react";
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

export * from "./BaseControlComponentProps";
export { ControlContext, useControlContext };

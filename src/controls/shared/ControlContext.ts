import { PCFControlContextService } from "pcf-react";
import * as React from "react";

const context = React.createContext<PCFControlContextService | undefined>(
  undefined
);

export default context;

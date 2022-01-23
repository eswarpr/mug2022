import * as ReactDOM from "react-dom";
import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { initializeIcons } from "@fluentui/react";
import {
  PCFControlContextService,
  ServiceProvider,
  StandardControlReact,
} from "pcf-react";
import { ControlContext } from "../shared";
import ImageListViewComponent from "./components/ImageListView";

export class ImageListView extends StandardControlReact<IInputs, IOutputs> {
  constructor() {
    super();
    initializeIcons();
    this.reactCreateElement = (
      container: HTMLDivElement,
      width: number | undefined,
      height: number | undefined,
      serviceProvider: ServiceProvider
    ) => {
      const service = serviceProvider.get<PCFControlContextService>(
        PCFControlContextService.serviceProviderName
      );

      ReactDOM.render(
        <ControlContext.Provider value={service}>
          <ImageListViewComponent
            width={width}
            height={height}
          ></ImageListViewComponent>
        </ControlContext.Provider>,
        container
      );
    };
  }
}

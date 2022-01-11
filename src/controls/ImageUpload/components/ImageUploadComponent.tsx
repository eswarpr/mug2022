import { IImageUploadComponentProps } from "./ImageUploadComponent.types";
import * as React from "react";
import { IInputs, IOutputs } from "../generated/ManifestTypes";
import { useControlContext } from "../../shared";
import {
  IconButton,
  Image,
  mergeStyleSets,
  Stack,
  useTheme,
  AnimationStyles,
  IButtonStyles,
} from "@fluentui/react";
import { useBoolean, useConst } from "@fluentui/react-hooks";

const ImageUploadComponent: React.FC<IImageUploadComponentProps> = ({
  width,
  height,
}) => {
  const [imageFieldName, setImageFieldName] = React.useState<string>();
  const [imageValue, setImageValue] = React.useState<any>();
  const [
    buttonPaneShown,
    { setTrue: showButtonPane, setFalse: hideButtonPane },
  ] = useBoolean(false);
  const [imageAltText, setImageAltText] = React.useState<string>();
  const theme = useTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const service = useControlContext();

  React.useEffect(() => {
    if (
      !!service &&
      !!imageValue &&
      !!imageFieldName &&
      !!!imageValue.url &&
      !!imageValue.dataUrl &&
      !!imageValue.image
    ) {
      const primaryId = service.getPrimaryId();
      const utility = service.getFormContext().utils;
      const clientUrl = service.getFormContext().page.getClientUrl();
      const entityName = primaryId.entityType;
      const entityId = primaryId.id;

      (async () => {
        // get the entity metadata
        const metadata = await utility.getEntityMetadata(entityName, []);

        const headers = new Headers();
        headers.append("Content-Type", "application/octet-stream");
        const results = await fetch(
          `${clientUrl}/api/data/v9.1/${metadata.EntitySetName}(${entityId})/${imageFieldName}`,
          {
            method: "PATCH",
            body: imageValue.image,
            headers,
          }
        );

        if (!!results.ok) {
          alert("The image has been updated");
        }
      })();
    }
  }, [service, imageValue, imageFieldName]);

  React.useEffect(() => {
    if (!!service && !!imageValue && !!imageValue.image) {
      const params = service.getParameters<IInputs>();
      if (!!params) {
        const { cognitiveServiceEndPoint, cognitiveServiceKey } = params;
        if (!!cognitiveServiceEndPoint && !!cognitiveServiceKey) {
          const { raw: endpoint } = cognitiveServiceEndPoint;
          const { raw: key } = cognitiveServiceKey;
          if (!!endpoint && !!key) {
            // query azure for a description of the image
            (async () => {
              const body =
                imageValue.image instanceof ArrayBuffer
                  ? imageValue.image
                  : Uint8Array.from(atob(imageValue.image), (c) =>
                      c.charCodeAt(0)
                    );
              const headers = new Headers();
              headers.append("Ocp-Apim-Subscription-Key", key);
              headers.append("Content-Type", "application/octet-stream");
              const description = await fetch(
                `${endpoint}/vision/v3.2/analyze?visualFeatures=Description`,
                {
                  method: "POST",
                  headers,
                  body,
                }
              )
                .then((x) => x.json())
                .then((x) => x.description.captions[0].text);

              // the description that we need
              setImageAltText(description);
            })();
          }
        }
      }
    }
  }, [service, imageValue]);

  React.useEffect(() => {
    if (!!service) {
      const params = service.getParameters<IInputs>();
      const primaryId = service.getPrimaryId();
      const utils = service.getFormContext().utils;
      const clientUrl = service.getFormContext().page.getClientUrl();

      const entityName = primaryId.entityType;

      if (!!params) {
        // the field attributes for the bound field
        var boundFieldAttribs = params.value.attributes;
        if (!!boundFieldAttribs && !!utils) {
          const targetFieldDisplayName = boundFieldAttribs.DisplayName.replace(
            "Edit",
            ""
          ).trim();

          (async () => {
            const targetField = await fetch(
              `${clientUrl}/api/data/v9.1/EntityDefinitions(LogicalName='${entityName}')/Attributes`
            )
              .then((x) => x.json())
              .then((x) => x.value)
              .then((x: any[]) =>
                x.find(
                  (y) =>
                    y.DisplayName.LocalizedLabels.length > 0 &&
                    y.DisplayName.LocalizedLabels[0].Label ===
                      targetFieldDisplayName
                )
              )
              .then((x) =>
                !!x && x.AttributeTypeName.Value === "ImageType"
                  ? x.LogicalName
                  : undefined
              );

            // target field
            setImageFieldName(targetField);
          })();
        }
      }
    }
  }, [service]);

  React.useEffect(() => {
    if (!!service && !!imageFieldName) {
      const primaryId = service.getPrimaryId();
      const utils = service.getFormContext().utils;
      const webApi = service.getFormContext().webAPI;

      const { id: entityId, entityType } = primaryId;

      (async () => {
        const result = await webApi
          .retrieveRecord(entityType, entityId)
          .then((x: any) => ({
            id: x[`${imageFieldName}id`],
            url: x[`${imageFieldName}_url`],
            timestamp: x[`${imageFieldName}_timestamp`],
            image: x[imageFieldName],
            dataUrl: undefined,
          }));

        setImageValue(result);
      })();
    }
  }, [service, imageFieldName]);

  const { root, overlay, buttonPane } = mergeStyleSets({
    root: {
      position: "relative",
    },
    overlay: {
      position: "absolute",
      left: 0,
      top: 0,
      width: "144px",
      height: "100%",
      display: "flex",
      justifyContent: "flex-end",
    },
    buttonPane: {
      width: 32,
      backgroundColor: theme.palette.blackTranslucent40,
      zIndex: 9999,
      height: "100%",
      ...AnimationStyles.fadeIn100,
    },
  });

  const handleOverlayMouseEnter = () => {
    showButtonPane();
  };

  const handleOverlayMouseLeave = () => {
    hideButtonPane();
  };

  const imageActions = useConst([
    {
      key: "edit",
      iconName: "Edit",
      alt: "Edit this image",
    },
    {
      key: "view",
      iconName: "OpenInNewWindow",
      alt: "View a bigger size of this image",
    },
  ]);

  const imageActionStyles: IButtonStyles = {
    icon: {
      width: 14,
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.8)",
    },
    iconHovered: {
      backgroundColor: theme.palette.black,
      color: "rgba(255, 255, 255, 0.9)",
    },
    iconPressed: {
      color: theme.palette.white,
    },
    rootHovered: {
      backgroundColor: theme.palette.black,
    },
    rootPressed: {
      backgroundColor: theme.palette.black,
    },
  };

  const handleActionClick = (action: string) => {
    switch (action) {
      case "edit": {
        // open file picker to allow users to select an image
        if (!!fileInputRef.current) {
          fileInputRef.current.click();
        }
        break;
      }
    }
  };

  const handleOverlayFocus = (ev: React.FocusEvent<HTMLDivElement>) => {
    showButtonPane();
  };

  const handleOverlayBlur = (ev: React.FocusEvent<HTMLDivElement>) => {
    hideButtonPane();
  };

  const handleFileSelectionChange = () => {
    if (!!fileInputRef.current) {
      const selection = fileInputRef.current.files;
      if (!!selection && selection.length > 0) {
        const _file = selection.item(0)!;
        const _reader = new FileReader();
        _reader.readAsArrayBuffer(_file);
        _reader.onloadend = () => {
          setImageValue({
            ...imageValue,
            image: _reader.result,
            dataUrl: URL.createObjectURL(_file),
            url: undefined,
          });
        };
      }
    }
  };

  return (
    <div className={root}>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        accept="image/jpeg image/png"
        onChange={handleFileSelectionChange}
        multiple={false}
        aria-hidden="true"
      ></input>
      <Stack horizontal role="group">
        <div role="img">
          <Image
            src={
              imageValue?.dataUrl ||
              imageValue?.url ||
              "https://via.placeholder.com/144x144.png?text=Preview"
            }
            width={144}
            alt={imageAltText}
          ></Image>
        </div>
        <div
          role="img"
          tabIndex={0}
          className={overlay}
          onMouseEnter={handleOverlayMouseEnter}
          onMouseLeave={handleOverlayMouseLeave}
          aria-label={imageAltText}
        >
          {!!buttonPaneShown && (
            <Stack
              tokens={{
                childrenGap: 4,
              }}
              className={buttonPane}
              role="menu"
            >
              {imageActions.map((x, n) => (
                <IconButton
                  role="menuitem"
                  key={x.key}
                  styles={imageActionStyles}
                  iconProps={{
                    iconName: x.iconName,
                  }}
                  tabIndex={n}
                  alt={x.alt}
                  ariaLabel={x.alt}
                  onClick={(ev) => handleActionClick(x.key)}
                ></IconButton>
              ))}
            </Stack>
          )}
        </div>
      </Stack>
    </div>
  );
};

export default ImageUploadComponent;

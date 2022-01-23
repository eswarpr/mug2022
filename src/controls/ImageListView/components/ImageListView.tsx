import * as React from "react";
import { useControlContext, useEntityRecords } from "../../shared";
import { ControlContextService, DatasetChangedEventArgs } from "pcf-react";
import { IImageListViewComponentProps } from "./ImageListView.types";
import {
  DocumentCard,
  DocumentCardDetails,
  DocumentCardLocation,
  DocumentCardPreview,
  DocumentCardStatus,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
  ImageFit,
  IStackStyles,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
} from "@fluentui/react";

interface IJobPhoto {
  altText?: string;
  photoUrl?: string;
  name?: string;
  status?: string;
}

const ImageListViewComponent: React.FC<IImageListViewComponentProps> = ({
  width,
  height,
}) => {
  const service = useControlContext();
  const [photos, setPhotos] = React.useState<IJobPhoto[]>();
  const entities = useEntityRecords();

  React.useEffect(() => {
    if (!!service && !!entities) {
      const clientUrl = service.getFormContext().page.getClientUrl();

      const entityName = service.getDataset().getTargetEntityType();
      const _photos: Array<IJobPhoto> = [];

      entities.forEach((e) => {
        _photos.push({
          name: e.getValue("epr_name") as string,
          altText: e.getValue("epr_detectedinformation") as string,
          photoUrl: `${clientUrl}/api/data/v9.1/${entityName}s(${e.getRecordId()})/epr_image/$value`,
          status: e.getFormattedValue("epr_relevancecheck"),
        });
      });

      setPhotos(_photos);
    }
  }, [service, entities]);

  const getMessageTypeFromStatus = (status?: string): MessageBarType => {
    if (status === "Approved") {
      return MessageBarType.success;
    } else if (status === "Rejected") {
      return MessageBarType.warning;
    } else {
      return MessageBarType.info;
    }
  };

  const getMessageFromStatus = (status?: string): string => {
    if (status === "Approved") {
      return "The photo has been approved because it is relevant to the job";
    } else if (status === "Rejected") {
      return "Please recheck the photograph. It does not seem relevant to this job";
    } else {
      return "The photo is pending approval";
    }
  };

  const getRelevanceMessage = (photo: IJobPhoto): JSX.Element => {
    const type = getMessageTypeFromStatus(photo.status);
    const message = getMessageFromStatus(photo.status);

    return (
      <MessageBar
        messageBarType={type}
        isMultiline={true}
        styles={{
          root: {
            width: 280,
          },
          text: {
            whiteSpace: "normal",
          },
        }}
      >
        {message}
      </MessageBar>
    );
  };

  const getDocumentCard = (photo: IJobPhoto): JSX.Element => {
    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          name: photo.name,
          previewImageSrc: photo.photoUrl,
          imageFit: ImageFit.center,
          height: 144,
        },
      ],
    };
    return (
      <DocumentCard>
        <DocumentCardPreview {...previewProps}></DocumentCardPreview>
        <DocumentCardLocation
          location={photo.name || ""}
        ></DocumentCardLocation>
        <DocumentCardDetails>{getRelevanceMessage(photo)}</DocumentCardDetails>
      </DocumentCard>
    );
  };

  const rootStackStyles: IStackStyles = {
    root: {
      paddingTop: 12,
    },
  };

  return (
    <Stack
      horizontal
      styles={rootStackStyles}
      tokens={{
        childrenGap: 8,
      }}
    >
      {!!photos && photos.map((photo) => getDocumentCard(photo))}
    </Stack>
  );
};

export default ImageListViewComponent;

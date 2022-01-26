import * as React from "react";
import { useParameters } from "../../shared";
import { IInputs } from "../generated/ManifestTypes";
import { IFeedbackGaugeComponentProps } from "./FeedbackGauge.types";
import { arc } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { IStackStyles, Stack, Text, useTheme } from "@fluentui/react";

interface IGaugeShapeParameters {
  valueFillArc?: string;
  width: number;
  valueFillColour?: string;
  text?: string;
}
const FeedbackGaugeComponent: React.FC<IFeedbackGaugeComponentProps> = ({
  width,
  height,
}) => {
  const [shapeParams, setShapeParams] = React.useState<IGaugeShapeParameters>({
    width: 300,
  });
  const theme = useTheme();
  const backgroundArc = arc().cornerRadius(1)({
    innerRadius: 0.65,
    outerRadius: 1,
    startAngle: -Math.PI / 2,
    endAngle: Math.PI / 2,
  });

  const parameters = useParameters<IInputs>();
  React.useEffect(() => {
    if (!!parameters?.value) {
      const { value } = parameters;
      const angle = scaleLinear()
        .domain([0, 1])
        .range([-Math.PI / 2, Math.PI / 2])
        .clamp(true)(value.raw || 0);

      const filledArc = arc().cornerRadius(1)({
        innerRadius: 0.65,
        outerRadius: 1,
        startAngle: -Math.PI / 2,
        endAngle: angle,
      });

      let fillColour = theme.palette.themePrimary;
      if (!!value && !!value.raw) {
        if (value.raw > 0.8) {
          fillColour = theme.palette.greenDark;
        } else if (value.raw > 0.4) {
          fillColour = theme.palette.orange;
        } else {
          fillColour = theme.palette.redDark;
        }
      }

      setShapeParams({
        valueFillArc: filledArc || undefined,
        width: !!width ? width - 40 : 300,
        valueFillColour: fillColour,
        text: `${
          (value.raw || 0) * 100
        }% of users from this account rated us positive for our services`,
      });
    }
  }, [parameters?.value, width, theme]);

  const rootStackStyles: IStackStyles = {
    root: {
      padding: 12,
    },
  };

  return (
    <Stack styles={rootStackStyles} tokens={{ childrenGap: 8 }}>
      <svg width={`${shapeParams?.width}px`} viewBox="-1 -1 2 1">
        <defs>
          <linearGradient
            id="Gauge__gradient"
            gradientUnits="userSpaceOnUse"
            x1="-1"
            x2="1"
            y2="0"
          ></linearGradient>
        </defs>
        <path
          d={backgroundArc || undefined}
          fill={theme.palette.neutralLight}
        ></path>
        {!!shapeParams?.valueFillArc && (
          <path
            d={shapeParams.valueFillArc}
            fill={shapeParams.valueFillColour}
          ></path>
        )}
      </svg>
      <Text variant="medium">{shapeParams?.text}</Text>
    </Stack>
  );
};

export default FeedbackGaugeComponent;

/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    value: ComponentFramework.PropertyTypes.DecimalNumberProperty;
    positiveFeedbackCount: ComponentFramework.PropertyTypes.WholeNumberProperty;
    negativeFeedbackCount: ComponentFramework.PropertyTypes.WholeNumberProperty;
    mixedFeedbackCount: ComponentFramework.PropertyTypes.WholeNumberProperty;
}
export interface IOutputs {
    value?: number;
    positiveFeedbackCount?: number;
    negativeFeedbackCount?: number;
    mixedFeedbackCount?: number;
}

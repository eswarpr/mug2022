/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    value: ComponentFramework.PropertyTypes.StringProperty;
    description: ComponentFramework.PropertyTypes.StringProperty;
    relevanceCheck: ComponentFramework.PropertyTypes.OptionSetProperty;
    cognitiveServiceEndPoint: ComponentFramework.PropertyTypes.StringProperty;
    cognitiveServiceKey: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    value?: string;
    description?: string;
    relevanceCheck?: number;
}

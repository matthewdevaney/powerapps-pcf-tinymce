/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    htmlText: ComponentFramework.PropertyTypes.StringProperty;
    editorHeight: ComponentFramework.PropertyTypes.StringProperty;
    fontFamily: ComponentFramework.PropertyTypes.StringProperty;
    fontSize: ComponentFramework.PropertyTypes.WholeNumberProperty;
    autoResize: ComponentFramework.PropertyTypes.TwoOptionsProperty;
}
export interface IOutputs {
    htmlText?: string;
}

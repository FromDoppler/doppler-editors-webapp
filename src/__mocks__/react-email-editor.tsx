import { Component } from "react";
import { EmailEditorProps } from "react-email-editor";

// This file is a quick and dirty way to inspect EmailEditor props
// I tried to use jest.mock in Editor.test.tsx but I had no luck
// I cannot nighter inspect the behavior of the real EmailEditor
// At least, this approach allow us to test the received props

const emailEditorPropsTestId = "EmailEditor_props";

export default class EmailEditor extends Component {
  constructor(props: EmailEditorProps) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <div data-testid={emailEditorPropsTestId}>
        {JSON.stringify(this.props)}
      </div>
    );
  }
}

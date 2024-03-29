import { FloatingLabel, Form } from "react-bootstrap";

export type LabeledInputProps = {
  type: string;
  label: string;
  disabled?: boolean;
  defaultValue?: any;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  labelClass?: any;
  inputClass?: any;
  controlId?: any;
}

export default function LabeledInput(props: LabeledInputProps) {
  return (
    <FloatingLabel
      controlId={props.controlId}
      label={props.label}
      className={props.labelClass}>
        <Form.Control
          className={props.inputClass}
          type={props.type}
          placeholder={props.label}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          onChange={props.onChange} />
    </FloatingLabel>
  )
}
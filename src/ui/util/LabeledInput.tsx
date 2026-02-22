import { FloatingLabel, Form } from "react-bootstrap";

export type LabeledInputProps = {
  type: string;
  label: string;
  disabled?: boolean;
  defaultValue?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  labelClass?: string;
  inputClass?: string;
  controlId?: string;
};

export default function LabeledInput(props: LabeledInputProps) {
  return (
    <FloatingLabel
      controlId={props.controlId}
      label={props.label}
      className={props.labelClass}
    >
      <Form.Control
        className={props.inputClass}
        type={props.type}
        placeholder={props.label}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        onChange={props.onChange}
      />
    </FloatingLabel>
  );
}

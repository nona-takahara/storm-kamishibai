import { Button, ButtonGroup, Form, Stack } from "react-bootstrap";
import {
  BsFillCaretDownFill,
  BsFillCaretUpFill,
  BsEye,
  BsArrowRight,
} from "react-icons/bs";
import Color from "../Color";
import Lut from "../Lut";
import ColorBox from "./util/ColorBox";
import ColorBoxOverlays from "./util/ColorBoxOverlays";

type ColorListItemProps = {
  order: number;
  orderListLength: number;
  undrawFlag: boolean;
  color: Color;
  onColorChange: React.ChangeEventHandler;
  onDrawFlagChange: React.ChangeEventHandler;
  onMoveUpClick: React.MouseEventHandler;
  onMoveDownClick: React.MouseEventHandler;
};

export default function ColorListItem(props: ColorListItemProps) {
  return (
    <Stack direction="horizontal" gap={2}>
      <Stack direction="horizontal" gap={2}>
        <ColorBoxOverlays
          r={props.color.originalR}
          g={props.color.originalG}
          b={props.color.originalB}
        />
        <BsArrowRight />
        <ColorBox
          r={Lut[props.color.convertedR]}
          g={Lut[props.color.convertedG]}
          b={Lut[props.color.convertedB]}
        />
      </Stack>
      <Form.Control
        type="text"
        defaultValue={`rgb(${props.color.convertedR}, ${props.color.convertedG}, ${props.color.convertedB})`}
        onChange={props.onColorChange}
      />
      <Form.Check
        className="ms-auto"
        type="switch"
        onChange={props.onDrawFlagChange}
        checked={!props.undrawFlag}
        label={<BsEye />}
      />
      <div className="ms-auto" />

      <div className="vr" />
      <ButtonGroup>
        <Button
          className="border-end"
          variant="secondary"
          size="sm"
          onClick={props.onMoveUpClick}
          disabled={props.order === 0 || props.order >= props.orderListLength}
        >
          <BsFillCaretUpFill />
        </Button>
        <Button
          className="border-start"
          variant="secondary"
          size="sm"
          onClick={props.onMoveDownClick}
          disabled={props.order >= props.orderListLength - 1}
        >
          <BsFillCaretDownFill />
        </Button>
      </ButtonGroup>
    </Stack>
  );
}

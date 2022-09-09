import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/types";

type ColorBoxProps = {
  r: number;
  g: number;
  b: number;
  placement?: Placement;
}

export default function ColorBoxOverlays(props: ColorBoxProps) {
  const overlay = (kprops: any) => (
    <Tooltip {...kprops}>
      {`rgb(${props.r}, ${props.g}, ${props.b})`}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      overlay={overlay} {...props}>
      <span style={{
        width: '1em',
        height: '1em',
        backgroundColor: `rgb(${props.r},${props.g},${props.b})`,
        border: '1px solid rgb(0,0,0)'
      }} /></OverlayTrigger>);
}

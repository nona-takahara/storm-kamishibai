type ColorBoxProps = {
  r: number;
  g: number;
  b: number;
};

export default function ColorBox(props: ColorBoxProps) {
  return (
    <span
      style={{
        width: "1em",
        height: "1em",
        backgroundColor: `rgb(${props.r},${props.g},${props.b})`,
        border: "1px solid rgb(0,0,0)",
      }}
    />
  );
}

import { Alignment, AnchorButton, Button, Navbar } from "@blueprintjs/core";

function KNav() {
  return (
    <Navbar fixedToTop={true}>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Storm Kamishibai</Navbar.Heading>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <AnchorButton className="bp4-minimal" icon="form" text="Inquire Form" href="https://forms.gle/TRxMsVQLBrCc3yJF7" />
        <Button className="bp4-minimal" icon="document" text="How to use" />
        <Button className="bp4-minimal" icon="info-sign" text="About" />
      </Navbar.Group>
    </Navbar>
  );

}

export default KNav;
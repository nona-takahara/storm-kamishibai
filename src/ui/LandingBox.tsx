import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import LocalizedMarkdown from "./LocalizedMarkdown";

type LandingBoxProps = {
  isVisible: boolean;
};

export default function LandingBox(props: LandingBoxProps) {
  const { i18n, t } = useTranslation();

  return (
    (props.isVisible && (
      <Card>
        <Card.Header>{t("landing.title")}</Card.Header>
        <Card.Body>
          <img
            src="example.png"
            className="m-1 float-end"
            alt={t("landing.exampleAlt")}
          />
          <LocalizedMarkdown
            pathBase="landing"
            language={i18n.resolvedLanguage ?? "ja"}
          />
        </Card.Body>
      </Card>
    )) || <></>
  );
}

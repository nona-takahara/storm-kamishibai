import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import type ModalProps from "../ModalProps";
import LocalizedMarkdown from "./LocalizedMarkdown";

export default function AboutModal(props: ModalProps) {
  const { i18n, t } = useTranslation();

  return (
    <Modal
      show={props.show}
      onHide={() => {
        props.onClose();
      }}
      aria-labelledby="contained-modal-title-vcenter"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("modal.aboutTitle")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LocalizedMarkdown
          pathBase="about"
          language={i18n.resolvedLanguage ?? "ja"}
        />
      </Modal.Body>
    </Modal>
  );
}

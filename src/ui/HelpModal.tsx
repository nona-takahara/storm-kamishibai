import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import type ModalProps from "../ModalProps";
import LocalizedMarkdown from "./LocalizedMarkdown";

export default function HelpModal(props: ModalProps) {
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
        <Modal.Title>{t("modal.helpTitle")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LocalizedMarkdown
          pathBase="help"
          language={i18n.resolvedLanguage ?? "ja"}
        />
      </Modal.Body>
    </Modal>
  );
}

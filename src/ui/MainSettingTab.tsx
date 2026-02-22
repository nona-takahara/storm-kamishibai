/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import React, { useCallback } from "react";
import {
  Alert,
  Card,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Stack,
} from "react-bootstrap";
import { BsExclamationCircle } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import Color from "../Color";
import type ConvertOption from "../ConvertOption";
import type LuaCodeOption from "../LuaCodeOption";
import ColorListItem from "./ColorListItem";
import LabeledInput from "./util/LabeledInput";

export type MainSettingTabPropsBase = {
  changeConvertSettings: (v: ConvertOption, needReconvert?: boolean) => void;
  changeLuaCodeSettings: (v: LuaCodeOption) => void;
  luaCodeOption: LuaCodeOption;
  convertOption: ConvertOption;
  colorSet?: Array<Color>;
  colorOrder: number[];
  transparentStartOrder: number;
  onColorChange: Function;
  onDrawFlagChange: Function;
  onMoveUpClick: Function;
  onMoveDownClick: Function;
};

export type MainSettingTabProps = MainSettingTabPropsBase;

const MainSettingTab: React.FC<MainSettingTabProps> = (props) => {
  const { t } = useTranslation();

  const handleColorChange = useCallback(
    (index: number, evt: React.ChangeEvent) => {
      props.onColorChange(index, (evt.target as HTMLInputElement).value);
    },
    [props],
  );

  const handleMoveUpClick = useCallback(
    (index: number, evt: React.MouseEvent) => {
      evt.preventDefault();
      props.onMoveUpClick(index);
    },
    [props],
  );

  const handleMoveDownClick = useCallback(
    (index: number, evt: React.MouseEvent) => {
      evt.preventDefault();
      props.onMoveDownClick(index);
    },
    [props],
  );

  const handleDrawFlagChange = useCallback(
    (index: number, evt: React.ChangeEvent) => {
      props.onDrawFlagChange(index, !(evt.target as HTMLInputElement).checked);
    },
    [props],
  );

  let list: boolean = false;
  if (props.colorSet !== undefined) {
    list = new Array(props.colorSet.length);
    for (let i = 0; i < props.colorSet.length; i++) {
      const undraw = props.colorOrder[i] >= props.transparentStartOrder;
      list[props.colorOrder[i]] = (
        <ListGroup.Item key={i} variant={undraw ? "secondary" : ""}>
          <ColorListItem
            order={props.colorOrder[i]}
            orderListLength={props.transparentStartOrder}
            undrawFlag={undraw}
            color={props.colorSet[i]}
            onColorChange={(e) => handleColorChange(i, e)}
            onDrawFlagChange={(e) => handleDrawFlagChange(i, e)}
            onMoveUpClick={(e) => handleMoveUpClick(i, e)}
            onMoveDownClick={(e) => handleMoveDownClick(i, e)}
          />
        </ListGroup.Item>
      );
    }
  }

  return (
    <Stack gap={2}>
      <Alert variant="info" className="mb-0">
        <Row>
          <Col xs="auto" className="pe-0">
            <BsExclamationCircle />
          </Col>
          <Col>{t("main.info")}</Col>
        </Row>
      </Alert>
      <Card>
        <Card.Header>{t("main.imageConversionSettings")}</Card.Header>
        <Card.Body>
          <Stack gap={1}>
            <Row>
              <Form.Label column xs={2}>
                {t("main.size")}
              </Form.Label>
              <InputGroup as={Col}>
                <LabeledInput
                  label={t("main.width")}
                  type="number"
                  defaultValue={props.convertOption.luaCardWidth}
                  onChange={(e) =>
                    props.changeConvertSettings(
                      { luaCardWidth: Number(e.target.value) },
                      true,
                    )
                  }
                />
                <LabeledInput
                  label={t("main.height")}
                  type="number"
                  defaultValue={props.convertOption.luaCardHeight}
                  onChange={(e) =>
                    props.changeConvertSettings(
                      { luaCardHeight: Number(e.target.value) },
                      true,
                    )
                  }
                />
              </InputGroup>
            </Row>
            <Row className="mt-3">
              <Form.Label column xs={2}>
                {t("main.offset")}
              </Form.Label>
              <InputGroup as={Col}>
                <LabeledInput
                  label={t("main.x")}
                  type="number"
                  defaultValue={props.convertOption.pictureOffsetX}
                  onChange={(e) =>
                    props.changeConvertSettings(
                      { pictureOffsetX: Number(e.target.value) },
                      true,
                    )
                  }
                />
                <LabeledInput
                  label={t("main.y")}
                  type="number"
                  defaultValue={props.convertOption.pictureOffsetY}
                  onChange={(e) =>
                    props.changeConvertSettings(
                      { pictureOffsetY: Number(e.target.value) },
                      true,
                    )
                  }
                />
              </InputGroup>
            </Row>
            <Row>
              <Form.Label column xs={2}>
                {t("main.skip")}
              </Form.Label>
              <InputGroup as={Col}>
                <LabeledInput
                  label={t("main.horizonal")}
                  type="number"
                  defaultValue={props.convertOption.pictureSkipH}
                  onChange={(e) =>
                    props.changeConvertSettings(
                      { pictureSkipH: Number(e.target.value) },
                      true,
                    )
                  }
                />
                <LabeledInput
                  label={t("main.vectral")}
                  type="number"
                  defaultValue={props.convertOption.pictureSkipV}
                  onChange={(e) =>
                    props.changeConvertSettings(
                      { pictureSkipV: Number(e.target.value) },
                      true,
                    )
                  }
                />
              </InputGroup>
            </Row>
          </Stack>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>{t("main.colorOrderAndDrawFlags")}</Card.Header>
        <Card.Body className="p-0">
          <ListGroup variant="flush">{list}</ListGroup>
        </Card.Body>
      </Card>
    </Stack>
  );
};

export default MainSettingTab;

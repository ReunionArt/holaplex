import NavContainer from '@/modules/nfts/components/wizard/NavContainer';
import { Divider, Input, Form, FormInstance, Row } from 'antd';
import React from 'react';
import Image from 'next/image';
import { StepWizardChildProps } from 'react-step-wizard';
import styled from 'styled-components';
import Button from '@/common/components/elements/Button';
import XCloseIcon from '@/common/assets/images/x-close.svg';
import GreenCheckIcon from '@/common/assets/images/green-check.svg';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { FormValues, MintDispatch } from 'pages/nfts/new';
import { StyledClearButton } from '@/modules/nfts/components/wizard/RoyaltiesCreators';

interface Props extends Partial<StepWizardChildProps> {
  images: Array<File>;
  index: number;
  form: FormInstance;
  clearForm: () => void;
  currentImage: File;
  isLast: boolean;
  dispatch: MintDispatch;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content min-content;
  width: 216px;
  column-gap: 16px;
  row-gap: 16px;
  max-height: 500px;
`;

const StyledDivider = styled(Divider)`
  background-color: rgba(255, 255, 255, 0.1);
  height: 500px;
  margin: 0 46px;
`;

const FormWrapper = styled.div`
  width: 413px;

  .ant-form-item-label {
    font-weight: 900;
  }

  .ant-form-item-control-input-content {
    input,
    textarea {
      border-radius: 4px;
    }
    input {
      height: 50px;
    }
  }
`;

const StyledButton = styled(Button)`
  background: #1a1a1a;
  border-radius: 4px;
  width: 39px;
  height: 50px;

  img {
    opacity: 0.5;
  }
`;

// TODO: Type the props
const AttributeClearButton = (props: any) => {
  return (
    <StyledButton {...props} noStyle={true}>
      <Image width={24} height={24} src={XCloseIcon} alt="remove-attribute" />
    </StyledButton>
  );
};

const ButtonFormItem = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
    flex-direction: row-reverse;
  }
`;

const CheckWrapper = styled.div`
  position: relative;
  height: 24px;
  width: 24px;
  top: -68px;
  right: -42px;
`;

const ImageOverlay = styled.div<{ isFinished?: boolean; isCurrent?: boolean }>`
  height: 108px;
  width: 108px;
  border-radius: 4px;
  padding: 4px;
  ${({ isCurrent }) => (isCurrent ? 'border: 2px solid #d24089;;' : null)}
  ${({ isFinished }) => (isFinished ? 'opacity: 0.5;' : null)}
`;

export default function InfoScreen({
  previousStep,
  goToStep,
  images,
  index,
  nextStep,
  form,
  isActive,
  clearForm,
  isLast,
  dispatch,
  currentImage,
}: Props) {
  const { TextArea } = Input;
  const nftNumber = `nft-${index}`;

  // useEffect(() => {
  //   if (isActive) {
  //     // const current = form.getFieldValue(nftNumber);
  //     // current.imageName = currentImage.name;
  //     // console.log('CURRENT IMAGE IS ', currentImage.name);
  //     // console.log('DEBUG CURRENT IS', current);
  //     // console.log('nftnumber is ', nftNumber);
  //     // form.setFieldsValue({ nftNumber: current });
  //   }
  // }, [isActive]);

  const handleNext = () => {
    form
      .validateFields([[nftNumber, 'name']])
      .then(() => {
        if (isLast) {
          form
            .validateFields()
            .then((values: FormValues) => {
              const arrayValues = Object.values(values).filter((v) => v !== undefined);
              console.log('array values are ', arrayValues);
              dispatch({ type: 'SET_FORM_VALUES', payload: arrayValues });
            })
            .catch((err) => {
              console.log('err', err);
            });
          // form.submit();
        }
        // TODO: Do we need this catch?
        nextStep!();
      })
      .catch((errors) => {
        nextStep!();
        console.log('Errors are', errors);
      });
  };

  const AttributeRow = ({
    remove,
    fieldsLength,
    field,
  }: {
    remove: (index: number | number[]) => void;
    fieldsLength: number;
    field: FormListFieldData;
  }) => (
    <Input.Group style={{ marginBottom: 18, display: 'flex', flexDirection: 'row' }}>
      <Form.Item name={[field.name, 'trait_type']}>
        <Input style={{ width: 178, marginRight: 10, borderRadius: 4 }} placeholder="e.g. Color" />
      </Form.Item>
      <Form.Item name={[field.name, 'value']}>
        <Input style={{ width: 178, marginRight: 8, borderRadius: 4 }} placeholder="e.g. Green" />
      </Form.Item>
      {fieldsLength > 1 && <AttributeClearButton onClick={() => remove(field.name)} />}
    </Input.Group>
  );

  return (
    <NavContainer
      title={`Info for #${index + 1} of ${images.length}`}
      previousStep={previousStep}
      goToStep={goToStep}
      clearForm={clearForm}
    >
      <Row>
        <FormWrapper>
          <Form.Item name={`nft-${0}`}>
            <Form.Item
              name={[nftNumber, 'name']}
              label="Name"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input placeholder="required" autoFocus />
            </Form.Item>
            <Form.Item name={[nftNumber, 'description']} label="Description">
              <TextArea
                placeholder="optional"
                autoSize={{ minRows: 3, maxRows: 8 }}
                defaultValue={''}
              />
            </Form.Item>
            <Form.Item name={[nftNumber, 'collection']} label="Collection">
              <Input placeholder="e.g. Stylish Studs (optional)" defaultValue={''} />
            </Form.Item>
            <Form.Item label="Attributes">
              <Form.List name={[nftNumber, 'attributes']} initialValue={[null]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <AttributeRow
                        key={field.key}
                        remove={remove}
                        fieldsLength={fields.length}
                        field={field}
                      />
                    ))}
                    {fields.length < 10 && (
                      <StyledClearButton onClick={add} type="default" noStyle={true}>
                        Add Attribute
                      </StyledClearButton>
                    )}
                  </>
                )}
              </Form.List>
            </Form.Item>
            <ButtonFormItem style={{ marginTop: 42 }}>
              <Button type="primary" onClick={handleNext}>
                Next
              </Button>
            </ButtonFormItem>
          </Form.Item>
        </FormWrapper>

        <StyledDivider type="vertical" />
        <Grid>
          {images.map((image, i) => (
            <ImageOverlay key={image.name} isFinished={i < index} isCurrent={i === index}>
              <Image
                width={100}
                height={100}
                src={URL.createObjectURL(image)}
                alt={image.name}
                unoptimized={true}
              />

              {i < index && (
                <CheckWrapper>
                  <Image width={24} height={24} src={GreenCheckIcon} alt="green-check" />
                </CheckWrapper>
              )}
            </ImageOverlay>
          ))}
        </Grid>
      </Row>
    </NavContainer>
  );
}

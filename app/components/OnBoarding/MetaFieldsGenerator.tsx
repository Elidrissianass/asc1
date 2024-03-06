import { Button, Icon, List, Spinner } from '@shopify/polaris';
import { CheckIcon, XSmallIcon } from '@shopify/polaris-icons';
import { useState } from 'react';
interface IMetaFieldsGenerator {
  increaseStep: () => void;
  shop: string;
}
type Feedback = 'success' | 'error' | 'loading' | 'idle';
const MetaFieldsGenerator = ({ increaseStep, shop }: IMetaFieldsGenerator) => {
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [nextStep, setNextStep] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback>('idle');

  const generateMetaFields = async () => {
    setButtonLoading(true);
    setFeedback('loading');
    const response = await fetch(`./onboard`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ step: 3, shopId: shop }),
    }).then((res) => res.json());
    if (response.message === 'updated') {
      setButtonLoading(false);
      setFeedback('success');
      setNextStep(true);
    } else {
      setButtonLoading(false);
      setFeedback('error');
    }
  };
  const stepHandler = async () => {
    increaseStep();
  };
  return (
    <>
      <div style={{ padding: '16px' }}>
        <List type="bullet" gap="loose">
          <List.Item>VAT</List.Item>
          <List.Item>Retail Price</List.Item>
          <List.Item>Wholesale Pricet</List.Item>
          <List.Item>Casing</List.Item>
        </List>
      </div>
      <div
        style={{
          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center',
          gap: '16px',
          paddingTop: '16px',
        }}
      >
        <div>
          {nextStep ? (
            <Button variant="primary" onClick={stepHandler}>
              Next Step
            </Button>
          ) : (
            <Button
              onClick={generateMetaFields}
              variant="primary"
              disabled={buttonLoading}
            >
              Generate
            </Button>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyItems: 'center',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {feedback === 'loading' && (
            <>
              <Spinner size="small" />
              <span>Attempting to generate meta fields...</span>
            </>
          )}

          {feedback === 'error' && (
            <>
              <Icon source={XSmallIcon} tone="critical" />
              <span>Invalid, operation failed !</span>
            </>
          )}
          {feedback === 'success' && (
            <>
              <Icon source={CheckIcon} tone="success" />
              <span>successfully generated !</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MetaFieldsGenerator;

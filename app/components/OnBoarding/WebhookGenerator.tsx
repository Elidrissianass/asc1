import { TextField, Box, Button, Icon, Spinner } from '@shopify/polaris';
import { CheckIcon, XSmallIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

interface IWebhookGeneratorCard {
  increaseStep: () => void;
  shop: string;
}
type Feedback = 'success' | 'error' | 'loading' | 'idle';
const WebhookGeneratorCard = ({
  shop,
  increaseStep,
}: IWebhookGeneratorCard) => {
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [nextStep, setNextStep] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');

  const handleClientId = useCallback(
    (newValue: string) => setClientId(newValue),
    [],
  );
  const handleClientSecret = useCallback(
    (newValue: string) => setClientSecret(newValue),
    [],
  );

  const generateWebhook = async () => {
    if (clientId && clientSecret) {
      setButtonLoading(true);
      setFeedback('loading');
      const response = await fetch(`./onboard`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step: 2, shopId: shop, clientId, clientSecret }),
      }).then((res) => res.json());
      if (response.message === 'updated') {
        setFeedback('success');
        setNextStep(true);
      } else {
        setButtonLoading(false);
        setFeedback('error');
      }
    }
  };
  const stepHandler = async () => {
    increaseStep();
  };
  return (
    <>
      <Box borderColor="border" borderWidth="0165">
        <img
          width="100%"
          src="https://burst.shopifycdn.com/photos/laptop-from-above.jpg?width=250&format=jpg"
          alt=""
        />
      </Box>
      <TextField
        label="Client Id"
        value={clientId}
        onChange={handleClientId}
        autoComplete="off"
      />
      <TextField
        label="Client Secret"
        value={clientSecret}
        onChange={handleClientSecret}
        autoComplete="off"
      />

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
              onClick={generateWebhook}
              variant="primary"
              disabled={buttonLoading}
            >
              Submit
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

export default WebhookGeneratorCard;

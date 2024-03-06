import { Box, Button } from '@shopify/polaris';
import { useState } from 'react';
interface IIntroductionCard {
  increaseStep: () => void;
  shop: string;
}

const IntroductionCard = ({ shop, increaseStep }: IIntroductionCard) => {
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const stepHandler = async () => {
    setButtonLoading(true);
    const response = await fetch(`./onboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ step: 1, shopId: shop }),
    }).then((res) => res.json());
    if (response.message === 'updated') {
      increaseStep();
    }
  };
  return (
    <>
      <Box>
        <img
          width="100%"
          src="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
          alt=""
        />
      </Box>
      <div style={{ paddingTop: '16px' }}>
        <Button variant="primary" onClick={stepHandler} loading={buttonLoading}>
          Next Step
        </Button>
      </div>
    </>
  );
};

export default IntroductionCard;

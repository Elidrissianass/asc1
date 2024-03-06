import { Divider, ProgressBar, Text } from '@shopify/polaris';

interface IHeadingCard {
  header: string;
  text: string;
  currentStep?: number;
}

const HeadingCard = ({ header, text, currentStep = 1 }: IHeadingCard) => {
  const fraction = currentStep / 4;
  const percentage = fraction * 100;
  const loaderStep = Math.round(percentage);
  return (
    <>
      <Text as="h2" variant="headingLg">
        {header}
      </Text>
      <Text as="p">{text}</Text>
      <div
        style={{
          width: 225,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {currentStep}/4{' '}
        <ProgressBar
          progress={loaderStep}
          animated
          size="small"
          tone="primary"
        />
      </div>
      <Divider />
    </>
  );
};
export default HeadingCard;

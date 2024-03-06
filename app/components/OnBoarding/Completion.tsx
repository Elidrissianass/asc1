import { Button, Text } from '@shopify/polaris';
import { Redirect } from '@shopify/app-bridge/actions';
import IMG from '~/assets/images/ankor_logo.png';

const Completion = () => {
  return (
    <>
      <div
        style={{
          padding: '32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <img src={IMG} alt="ankorstore logo"></img>
        <Text as="h1" fontWeight="bold" variant="headingMd">
          The app is now fully configured ! It is time to prepare your products
          now.
        </Text>
        <Text as="p">
          You now need to add products manually to the Ankorstore Sales Channel
          App and complete the mandatory fields. Until this is done, the app
          will be inactive.
        </Text>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '16px',
          }}
        >
          <Button url="./settings" variant="secondary">
            Settings of the app
          </Button>
          <Button
            onClick={() => {
              redirect.dispatch(Redirect.Action.APP, '/settings');
            }}
            variant="primary"
            disabled
          >
            Go to products
          </Button>
        </div>
      </div>
    </>
  );
};

export default Completion;

import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';
import { getEllipsisTxt } from 'utils/format';
import { useRouter } from 'next/router';
import { useAuthRequestChallengeEvm } from '@moralisweb3/next';

const ConnectWC = () => {
  const { connectAsync } = useConnect(
    // 
    // This is where I added the walletconnection...
    //
    {connector: new WalletConnectConnector({ options: { qrcode: true } }),}
    );
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const toast = useToast();
  const { data } = useSession();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }
    try {
      const { account, chain } = await connectAsync();

      const challenge = await requestChallengeAsync({ address: account, chainId: chain.id });

      if (!challenge) {
        throw new Error('No challenge received');
      }

      const signature = await signMessageAsync({ message: challenge.message });

      await signIn('moralis-auth', { message: challenge.message, signature, network: 'Evm', redirect: false });
    } catch (e) {
      toast({
        title: 'Oops, something went wrong...',
        description: (e as { message: string })?.message,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  const handleDisconnect = async () => {
    await disconnectAsync();
    signOut({ callbackUrl: '/' });
  };

  if (data?.user) {
    // return (
    //   <HStack onClick={handleDisconnect} cursor={'pointer'}>
    //     <Avatar size="xs" />
    //     <Text fontWeight="medium">{getEllipsisTxt(data.user.address)}</Text>
    //   </HStack>
    // );
    return null;
  }

  return (
    <Button size="sm" onClick={handleAuth} colorScheme="blue">
      WalletConnect
    </Button>
  );
};

export default ConnectWC;

import { InjectedConnector } from 'wagmi/connectors/injected';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';
import { getEllipsisTxt } from 'utils/format';
import { useAuthRequestChallengeEvm } from '@moralisweb3/next';

const ConnectButton = () => {
  const { connectAsync } = useConnect({ connector: new InjectedConnector() });
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
    return (
      <HStack >
        <Avatar size="xs" />
        <Text fontWeight="medium">{getEllipsisTxt(data.user.address)}</Text>
        <Button fontWeight="medium" onClick={handleDisconnect} cursor={'pointer'}>Sign out</Button>
      </HStack>
    );
  }

  return (
    <Button size="sm" onClick={handleAuth} colorScheme="blue">
      MetaMask
    </Button>
  );
};

export default ConnectButton;

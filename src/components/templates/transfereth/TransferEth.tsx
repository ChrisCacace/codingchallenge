import { CheckCircleIcon, SettingsIcon } from '@chakra-ui/icons';
import { Heading, VStack, List, ListIcon, ListItem } from '@chakra-ui/react';
import { useEvmNativeBalance } from '@moralisweb3/next';
import { useSession } from 'next-auth/react';
import { useNetwork } from 'wagmi';
import { useEvmWalletTransactions } from '@moralisweb3/next';
import React, {useEffect, useId, useState} from 'react';
import ReactDOM from "react-dom";
import { useWeb3Transfer } from "react-moralis"; 
import { MoralisProvider } from "react-moralis";
import { useMoralis } from "react-moralis";



const TransferEth = () => {

  // const { data } = useSession();
  // const { chain } = useNetwork();
  // const { data: transactions } = useEvmWalletTransactions({
  //   address: data?.user?.address,
  //   chain: chain?.id,
  // });

  // const { data: nativeBalance } = useEvmNativeBalance({ address: data?.user?.address, chain: chain?.id });

  /////////  /////////
  
  const [address, setaddress] = useState('');
  const [amount, setamount] = useState('');

  async function sendEth(amountEth, addressEth){
    
    const { fetch, error, isFetching } = useWeb3Transfer({
      type: "native",
      amount: amountEth,
      receiver: addressEth,
    });

    // let result = await Moralis.transfer(options);
  }

  // amount: (`${amount}`),
  // receiver: `${address}`,

  const  handleSubmit = (event) => {
    event.preventDefault();

    sendEth(`${amount}`,`${address}`)
    setaddress('');
    setamount('');
  };



  return (
    <>
    {/* <Heading size="lg" marginBottom={6}>
      Your {chain?.name} Balance - {nativeBalance?.balance.ether} ETH
    </Heading> */}
    
    <Heading size="lg" marginBottom={6}>
      Transfer Eth 
    </Heading>

    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id="address"
        name="address"
        value={address}
        placeholder="Address"
        onChange={(event) =>
          setaddress(event.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        id="amount"
        name="amount"
        value={amount}
        placeholder="Amount in Gwei"
        onChange={(event) => {
          setamount(event.target.value);
        }}
      />

      <br />
      <br />

      <button type="submit">Send</button>

      <br />
      <br />

    </form>

    </>
  );
};

export default TransferEth;

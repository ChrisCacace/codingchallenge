import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Heading,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEvmWalletTransactions } from '@moralisweb3/next';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { getEllipsisTxt } from 'utils/format';
import { useNetwork } from 'wagmi';
import { useEvmNativeBalance } from '@moralisweb3/next';


const Transactions = () => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const { data } = useSession();
  const { chain } = useNetwork();
  const { data: transactions } = useEvmWalletTransactions({
    address: data?.user?.address,
    chain: chain?.id,
  });
  const { data: nativeBalance } = useEvmNativeBalance({ address: data?.user?.address, chain: chain?.id });


  useEffect(() => console.log('transactions: ', transactions), [transactions]);


  return (
    <>
      <Heading size="lg" marginBottom={6}>
        Your {chain?.name} Balance - {nativeBalance?.balance.ether} ETH
      </Heading>

      <Heading size="lg" marginBottom={6}>
        Your Transactions
      </Heading>
      {transactions?.length ? (
        <Box border="2px" borderColor={hoverTrColor} borderRadius="xl" padding="24px 18px">
          <TableContainer w={'full'}>
            <Table>
              <Thead style={{ textAlign: "left" }}>
                <Tr>
                  <Th>Hash</Th>
                  <Th>From</Th>
                  <Th>To</Th>
                  <Th>Gas used</Th>
                  <Th>Date</Th>
                  <Th isNumeric>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions?.map((tx, key) => (
                  
                  <Tr key={key} _hover={{ bgColor: hoverTrColor }} cursor="pointer">
                    
                    <a href={'https://' + chain?.name + '.etherscan.io/tx/'+ tx?.hash}> 
                    <Td>{getEllipsisTxt(tx?.hash)}</Td>
                    <Td>{getEllipsisTxt(tx?.from.checksum)}</Td>
                    <Td>{getEllipsisTxt(tx?.to?.checksum)}</Td>
                    <Td>{tx.gasUsed.toString()}</Td>
                    <Td>{new Date(tx.blockTimestamp).toLocaleDateString()}</Td>
                    <Td isNumeric>{tx.receiptStatus}</Td>
                    </a>
                    
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>Looks Like you do not have any transactions</Box>
      )}
    </>
  );
};

export default Transactions;

import { Home } from '@web3uikit/icons';
import { Default } from 'components/layouts/Default';
import { Transactions } from 'components/templates/transactions';
import { TransferEth } from 'components/templates/transfereth';
import type { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <Default pageName="Transactions">
      <Transactions />
    </Default>
  );
};

export default HomePage;

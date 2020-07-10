import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    function formatDate(date: Date): string {
      const day = date.getDate().toString();
      const month = (date.getMonth() + 1).toString();
      const year = date.getFullYear().toString();

      const formattedDay = day.length === 1 ? `0${day}` : day;
      const formattedMonth = month.length === 1 ? `0${month}` : month;

      const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

      return formattedDate;
    }

    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      const transactionsObj: Transaction[] = response.data.transactions;

      const newTransactions = transactionsObj.map(transaction => {
        const newTransaction = transaction;

        newTransaction.formattedValue = formatValue(transaction.value);
        newTransaction.formattedDate = formatDate(
          new Date(transaction.created_at),
        );

        return newTransaction;
      });

      const newBalance: Balance = response.data.balance;

      newBalance.income = formatValue(Number(newBalance.income));
      newBalance.outcome = formatValue(Number(newBalance.outcome));
      newBalance.total = formatValue(Number(newBalance.total));

      setBalance(newBalance);
      setTransactions(newTransactions);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.type === 'outcome'
                      ? `- ${transaction.formattedValue}`
                      : transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;

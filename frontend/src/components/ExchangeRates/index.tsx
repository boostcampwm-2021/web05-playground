import React from 'react';
import { useQuery, gql } from '@apollo/client';

const EXCHANGE_RATES = gql`
    query GetExchangeRates {
        rates(currency: "USD") {
            currency
            rate
        }
    }
`;

const ExchangeRates = () => {
    const { loading, error, data } = useQuery(EXCHANGE_RATES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const exchangeRatesList = data.rates.map(({ currency, rate }: any) => (
        <div key={currency}>
            <p>
                {currency}: {rate}
            </p>
        </div>
    ));

    return (
        <>
            <h2>My first Apollo app 🚀</h2>
            {exchangeRatesList}
        </>
    );
};

export default ExchangeRates;

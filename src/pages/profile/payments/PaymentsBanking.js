import React from 'react';
import PaymentMethods from './PaymentMethods';
import Section from '../../product/components/Section/Section';
import s from '../../product/components/Banner/Banner.module.scss';

const PaymentsBanking = () => (
  <div>
    <h2>Payments & Banking</h2>
    <Section title="Payment Methods">
      <p>Manage your payment cards and connected accounts:</p>
      <PaymentMethods />
    </Section>
    <Section title="Banking Details">
      <p>Bank account info and payout preferences will appear here.</p>
    </Section>
    <Section title="Transaction History">
      <p>Recent transactions and payment activity will be shown here.</p>
    </Section>
  </div>
);

export default PaymentsBanking;

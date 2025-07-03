import React from 'react';
import mastercard from '../../../images/payments/mastercard.svg';
import visa from '../../../images/payments/visa.svg';
import aexpress from '../../../images/payments/aexpress.svg';
import paypal from '../../../images/payments/paypal.svg';
import s from '../../../pages/product/components/Banner/Banner.module.scss';

const PaymentMethods = () => (
  <div className={s.payments}>
    <div style={{ backgroundImage: `url(${visa})` }} />
    <div style={{ backgroundImage: `url(${mastercard})` }} />
    <div style={{ backgroundImage: `url(${aexpress})` }} />
    <div style={{ backgroundImage: `url(${paypal})` }} />
  </div>
);

export default PaymentMethods;

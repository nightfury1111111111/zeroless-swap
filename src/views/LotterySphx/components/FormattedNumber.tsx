import React from 'react';
import NumberFormat from 'react-number-format'

export function FormattedNumber({prefix, value, suffix }) {
  return (
    <NumberFormat
      value={value}
      displayType='text'
      prefix={prefix}
      suffix={suffix}
      thousandSeparator
      decimalScale={2}
      style={{fontFamily:'Raleway', color: '#F2C94C'}}
    />
  );
}

export default FormattedNumber
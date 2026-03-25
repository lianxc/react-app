import React from 'react';
import TaxProofComponent from './TaxProofComponent';

const TaxProofDemo: React.FC = () => {
  return (
    <div className="demo-container">
      <h2>个税证明组件演示</h2>
      <TaxProofComponent
        employeeName="张三"
        idNumber="110101199001011234"
        taxYear="2023"
        totalIncome={120000}
        totalTax={14400}
        taxRate={12}
      />
    </div>
  );
};

export default TaxProofDemo;
import React from 'react';
import './TaxProofComponent.css';

interface TaxProofComponentProps {
  employeeName: string;
  idNumber: string;
  taxYear: string;
  totalIncome: number;
  totalTax: number;
  taxRate: number;
}

const TaxProofComponent: React.FC<TaxProofComponentProps> = ({
  employeeName = '张三',
  idNumber = '110101199001011234',
  taxYear = '2023',
  totalIncome = 120000,
  totalTax = 14400,
  taxRate = 12
}) => {
  return (
    <div className="tax-proof-container">
      <div className="header">
        <h1 className="title">个人所得税纳税证明</h1>
        <div className="subtitle">中华人民共和国</div>
      </div>

      <div className="info-section">
        <div className="info-item">
          <span className="label">纳税人姓名：</span>
          <span className="value">{employeeName}</span>
        </div>
        <div className="info-item">
          <span className="label">身份证号：</span>
          <span className="value">{idNumber}</span>
        </div>
        <div className="info-item">
          <span className="label">纳税年度：</span>
          <span className="value">{taxYear}年度</span>
        </div>
      </div>

      <div className="table-section">
        <table className="tax-table">
          <thead>
            <tr>
              <th>项目</th>
              <th>金额（元）</th>
              <th>税率</th>
              <th>税额（元）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>工资薪金所得</td>
              <td>{totalIncome.toLocaleString()}</td>
              <td>{taxRate}%</td>
              <td>{totalTax.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="summary-section">
        <div className="summary-item">
          <span className="summary-label">应纳税所得额：</span>
          <span className="summary-value">{totalIncome.toLocaleString()}元</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">应纳税额：</span>
          <span className="summary-value">{totalTax.toLocaleString()}元</span>
        </div>
      </div>

      <div className="footer">
        <div className="issued-by">国家税务总局监制</div>
        <div className="date">2024年3月19日</div>
      </div>
    </div>
  );
};

export default TaxProofComponent;
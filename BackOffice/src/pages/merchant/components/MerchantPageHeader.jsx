import Card from '../../../components/ui/Card';

const MerchantPageHeader = ({ eyebrow, title, subtitle, status, statusClassName, badge, actions }) => {
  return (
    <Card className="merchant-page-header">
      <div>
        <p className="merchant-eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        {subtitle ? <p className="merchant-page-subtitle">{subtitle}</p> : null}
      </div>
      <div className="merchant-page-actions">
        {status ? <div className={statusClassName || 'merchant-status'}>{status}</div> : null}
        {badge ? <div className="merchant-status">{badge}</div> : null}
        {actions}
      </div>
    </Card>
  );
};

export default MerchantPageHeader;
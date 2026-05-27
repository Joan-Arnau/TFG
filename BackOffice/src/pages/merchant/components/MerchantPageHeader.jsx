import Card from '../../../components/ui/Card';

const MerchantPageHeader = ({ eyebrow, title, subtitle, badge, actions }) => {
  return (
    <Card className="merchant-page-header">
      <div>
        <p className="merchant-eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        {subtitle ? <p className="merchant-page-subtitle">{subtitle}</p> : null}
      </div>
      <div className="merchant-page-actions">
        {badge ? <div className="merchant-status">{badge}</div> : null}
        {actions}
      </div>
    </Card>
  );
};

export default MerchantPageHeader;

const Featured = ({ status: plans = [],  Classes = '' }) => {

    const planLabels = {
        featured: 'Featured',
        top: 'Top',
        bump: 'Bump Up',
        similar: 'Similar',
    }

    const badgeColors = {
        featured: 'badge-soft-success',
        top: 'badge-soft-warning',
        bump: 'badge-soft-primary',
        similar: 'badge-soft-info',
    }
    if(plans.length > 0){
        console.log("Plans ",plans)
    }

    return (
        <>
            {plans.length > 0 && (
                <div className={`d-flex flex-column ${Classes}`}>
                    {plans.map((plan, index) => (
                        <small
                            key={index}
                            className={`badge fw-semi-bold  status  cursor-pointer mb-1 ${badgeColors[plan.plan_type] || 'badge-soft-secondary'}`}
                        >
                            {planLabels[plan.plan_type] || plan.plan_type}
                        </small>
                    ))}
                </div>
            )}
        </>
    )
}

export default Featured
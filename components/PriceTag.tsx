import { formatDateHe, formatPrice, isLaunchActive, pricing } from "@/config/site";

/** מחיר אמיתי לפי התאריך הנוכחי בשרת. אין טיימר – רק תאריך סיום אמיתי. */
export default function PriceTag() {
  const launch = isLaunchActive();
  const discount = Math.round((1 - pricing.launchPrice / pricing.regularPrice) * 100);
  if (!launch) {
    return (
      <div className="price-row">
        <span className="price-new">{formatPrice(pricing.regularPrice)}</span>
      </div>
    );
  }
  return (
    <>
      <span className="badge">מחיר השקה · {discount}% הנחה</span>
      <div className="price-row">
        <span className="price-old">
          <span className="sr-only">מחיר רגיל: </span>
          {formatPrice(pricing.regularPrice)}
        </span>
        <span className="price-new">
          <span className="sr-only">מחיר השקה: </span>
          {formatPrice(pricing.launchPrice)}
        </span>
      </div>
      <p className="fineprint">
        מחיר ההשקה בתוקף עד {formatDateHe(pricing.launchEndsAt)} (כולל). לאחר מכן המחיר יחזור ל-{formatPrice(pricing.regularPrice)}.
      </p>
    </>
  );
}

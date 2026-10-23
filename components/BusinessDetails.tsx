import { business } from "@/config/site";

export default function BusinessDetails() {
  return (
    <address>
      <div>{business.legalName}</div>
      <div>{business.type} · מס׳ {business.registrationNumber}</div>
      <div>{business.address}</div>
      <div>
        טלפון: <a href={`tel:${business.phone.replace(/[^\d+]/g, "")}`}>{business.phone}</a>
      </div>
      <div>
        אימייל: <a href={`mailto:${business.email}`}>{business.email}</a>
      </div>
    </address>
  );
}

import React from "react";
import LegalPage from "./LegalPage";

export default function ReturnsPolicy() {
  return (
    <LegalPage title="Returns, Replacements & Refunds Policy">
      <section>
        <h2>1. Scope</h2>
        <p>
          This policy applies to all orders placed with MADHU वन          ("we", "us"). By placing an order, you agree to this policy.
        </p>
      </section>

      <section>
        <h2>2. Eligible Claims</h2>
        <p>We accept claims only if, on delivery:</p>
        <ul>
          <li>The pack is torn, leaking or visibly damaged.</li>
          <li>
            The product is not what you ordered, including the wrong type,
            grade or pack size.
          </li>
          <li>
            The pack contains foreign matter, such as insects, stones or
            other contamination.
          </li>
          <li>An item is missing from your order.</li>
        </ul>
        <p>All claims are subject to our verification.</p>
      </section>

      <section>
        <h2>3. Reporting Deadline</h2>
        <p>
          Please report any eligible issue within 48 hours of delivery.
          Claims submitted after this period may be declined.
        </p>
      </section>

      <section>
        <h2>4. Evidence Required</h2>
        <p>Your claim must include:</p>
        <ol>
          <li>Your order number.</li>
          <li>A description of the issue.</li>
          <li>
            Photos of the product, packaging and shipping label.
          </li>
          <li>
            An unboxing video recorded from the sealed parcel through
            to the opened pack.
          </li>
          <li>
            For weight disputes, a photo of the pack on a calibrated
            digital scale, with the packaging weighed separately.
          </li>
        </ol>
        <p>Claims without sufficient evidence may be declined.</p>
      </section>

      <section>
        <h2>5. What Is Not a Defect</h2>
        <p>We do not accept claims for:</p>
        <ul>
          <li>Lumps or clumping caused by humidity or storage after delivery.</li>
          <li>
            Natural variation in grain size, colour or sparkle between
            batches.
          </li>
          <li>Ants, moisture or contamination arising after delivery.</li>
          <li>Opened, used or partly used packs.</li>
          <li>
            Change of mind, taste preference, or incorrect address or
            details provided by you.
          </li>
          <li>Slight weight variation within normal packing tolerance.</li>
          <li>
            Damage or delay caused by the courier after delivery has
            been notified.
          </li>
        </ul>
        <p>
          Food products cannot be returned for hygiene and safety reasons.
          They qualify for a remedy only under Section 2.
        </p>
        <p>
          This section does not limit any rights you have under applicable law.
        </p>
      </section>

      <section>
        <h2>6. How to Claim</h2>
        <ol>
          <li>
            Email us at <strong>[Your Support Email]</strong> within the
            reporting deadline, including the evidence listed above.
          </li>
          <li>We will respond within 2–3 business days.</li>
          <li>
            Do not send any product back unless we ask you to do so in
            writing. Unauthorised returns will not be accepted.
          </li>
        </ol>
        <p>We may resolve a claim without requiring a return.</p>
      </section>

      <section>
        <h2>7. Resolution</h2>
        <p>
          If a claim is approved, we will determine the appropriate remedy:
          replacement, partial refund, full refund or store credit.
          Replacements are subject to stock availability.
        </p>
        <p>
          Where a return is required, we will provide instructions and bear
          the return shipping cost only if the error was ours.
        </p>
      </section>

      <section>
        <h2>8. Refunds</h2>
        <ul>
          <li>Refunds are issued to the original payment method only.</li>
          <li>
            Approved refunds are issued within 5–7 business days of approval.
            Your bank or payment provider may take additional time.
          </li>
          <li>
            Shipping charges and payment gateway fees are non-refundable,
            except where the error was ours.
          </li>
        </ul>
      </section>

      <section>
        <h2>9. Cancellations</h2>
        <ul>
          <li>
            Orders may be cancelled only before dispatch, meaning before
            a tracking number is issued.
          </li>
          <li>
            To request a cancellation, email us your order number.
            Dispatched orders cannot be cancelled.
          </li>
          <li>
            Accepted cancellations are refunded under Section 8, after
            any applicable gateway charges.
          </li>
        </ul>
      </section>

      <section>
        <h2>10. Our Rights</h2>
        <p>
          We may decline claims that do not meet this policy, appear
          fraudulent or are repeatedly abused. We may update this policy
          at any time. The version in force when you placed your order
          applies to that order.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <div className="legal-page__contact">
          <p><strong>Business name:</strong> MADHU वन</p>
          <p><strong>Email:</strong> [Your Support Email]</p>
          <p><strong>Phone:</strong> [Your Business Phone]</p>
          <p><strong>Address:</strong> [Your Business Address]</p>
          <p><strong>Grievance Officer:</strong> [Name and Details]</p>
        </div>
      </section>
    </LegalPage>
  );
}
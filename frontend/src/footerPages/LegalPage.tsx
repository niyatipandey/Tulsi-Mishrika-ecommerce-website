import React from "react";
import "./LegalPage.css";

type LegalPageProps = {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

export default function LegalPage({
  title,
  lastUpdated,
  children,
}: LegalPageProps) {
  return (
    <main className="legal-page">
      <div className="legal-page__header">
        <p className="legal-page__eyebrow">TULSI MISHRIKA</p>
        <h1>{title}</h1>
        {lastUpdated && (
          <p className="legal-page__updated">Last updated: {lastUpdated}</p>
        )}
      </div>

      <article className="legal-page__content">{children}</article>
    </main>
  );
}
"use client";

import { useTranslations } from "next-globe-gen";

export default function Overview() {
  const t = useTranslations();
  const tt = t as any;
  return (
    <div className="case-overview">
      <div className="case-overview__layout">
        {/* Left column: overview details */}
        <section className="case-overview__left">
          <div className="case-overview__card">
            <header className="case-overview__header">
              <h2 className="case-overview__title">{tt("trackCase.overview.title")}</h2>
              <span className="case-overview__status case-overview__status--review">
                {tt("trackCase.overview.status.underReview")}
              </span>
            </header>

            <div className="case-overview__grid">
              <div className="case-overview__section">
                <h3 className="case-overview__section-title">{tt("trackCase.overview.basicInfo")}</h3>
                <dl className="case-overview__dl">
                  <div className="case-overview__row">
                    <dt className="case-overview__dt">{tt("trackCase.overview.dateOfDisappearance")}</dt>
                    <dd className="case-overview__dd">23 Feb 2024</dd>
                  </div>
                  <div className="case-overview__row">
                    <dt className="case-overview__dt">{tt("trackCase.overview.details")}</dt>
                    <dd className="case-overview__dd">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non.</dd>
                  </div>
                </dl>
              </div>

              <div className="case-overview__section">
                <h3 className="case-overview__section-title">{tt("trackCase.overview.files")}</h3>
                <ul className="case-overview__files">
                  <li className="case-overview__file">ID.pdf</li>
                  <li className="case-overview__file">Proposal.pdf</li>
                  <li className="case-overview__file">Case.pdf</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Right column: chat/messages */}
        <aside className="case-overview__right">
          <div className="chat">
            <div className="chat__header">
              <div className="chat__avatar">MM</div>
              <div className="chat__meta">
                <span className="chat__role">{tt("trackCase.overview.lawyer")}</span>
                <span className="chat__name">Moahmoud Mansour</span>
              </div>
            </div>

            <div className="chat__messages">
              <article className="chat__message">
                <div className="chat__date">23 Feb 2024</div>
                <h4 className="chat__title">{tt("trackCase.overview.updateTitle")}</h4>
                <p className="chat__text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis augue eu purus rhoncus placerat.</p>
                <button className="chat__attachment">ID.PDF</button>
              </article>
              <article className="chat__message">
                <div className="chat__date">23 Feb 2024</div>
                <p className="chat__text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis augue eu purus rhoncus placerat.</p>
              </article>
            </div>

            <form className="chat__form" onSubmit={(e) => e.preventDefault()}>
              <label className="chat__label" htmlFor="message">
                {tt("trackCase.overview.message")}
              </label>
              <textarea id="message" className="chat__textarea" placeholder={tt("trackCase.overview.messagePlaceholder")?.toString()} maxLength={500} />
              <div className="chat__actions">
                <button className="chat__btn" type="submit">{tt("trackCase.overview.next")}</button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}



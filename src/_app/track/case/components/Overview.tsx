"use client";

import { useTranslations } from "next-globe-gen";
import { useState } from "react";
import { IconTag, IconFileText, IconDownload, IconPaperclip } from "@tabler/icons-react";

export default function Overview() {
  const t = useTranslations();
  const tt = t as any;
  const [message, setMessage] = useState("");
  return (
    <div className="case-overview">
      <div className="case-overview__layout">
        {/* Left column: overview details */}
        <section className="case-overview__left">
          <div className="case-overview__card">
            <div className="case-overview__date">23 FEB 2024</div>
            <h1 className="case-overview__main-title">
              {tt("trackCase.overview.detainee")}: Khaled Ahmed Shaban
            </h1>
            <span className="case-overview__badge">
              <IconTag size={18} />{" "}
              {tt("trackCase.overview.status.underReview")}
            </span>
            <hr className="case-overview__divider" />

            <div className="case-overview__grid">
              <div className="case-overview__section">
                <h3 className="case-overview__section-title">
                  {tt("trackCase.overview.basicInfo")}
                </h3>
                <dl className="case-overview__dl">
                  <div className="case-overview__row">
                    <dt className="case-overview__dt">
                      {tt("trackCase.overview.dateOfDisappearance")}
                    </dt>
                    <dd className="case-overview__dd">23 Feb 2024</dd>
                  </div>
                  <div className="case-overview__row">
                    <dt className="case-overview__dt">
                      {tt("trackCase.overview.details")}
                    </dt>
                    <dd className="case-overview__dd">
                      Lorem Ipsum Is Simply Dummy Text Of The Printing And
                      Typesetting Industry. Lorem Ipsum Has Been The
                      Industry&#39;s Standard Dummy Text Ever Since The 1500s,
                      When An Unknown Printer Took A Galley Of Type And
                      Scrambled It To Make A Type Specimen Book. It Has Survived
                      Not Only Five Centuries, But Also The Leap Into Ele
                      <a className="case-overview__read-more" href="#">
                        {tt("trackCase.overview.readMore")}
                      </a>
                    </dd>
                  </div>
                  <div className="case-overview__row">
                    <dt className="case-overview__dt">
                      {tt("trackCase.overview.files")}
                    </dt>
                    <dd className="case-overview__dd">
                      <ul className="case-overview__files">
                        <li className="case-overview__file">
                          <span className="case-overview__file-left">
                            <IconFileText size={18} /> ID.PDF
                          </span>
                          <button
                            className="case-overview__file-download"
                            aria-label="download"
                          >
                            <IconDownload size={18} />
                          </button>
                        </li>
                        <li className="case-overview__file">
                          <span className="case-overview__file-left">
                            <IconFileText size={18} /> Proposal.PDF
                          </span>
                          <button
                            className="case-overview__file-download"
                            aria-label="download"
                          >
                            <IconDownload size={18} />
                          </button>
                        </li>
                        <li className="case-overview__file">
                          <span className="case-overview__file-left">
                            <IconFileText size={18} /> Case.PDF
                          </span>
                          <button
                            className="case-overview__file-download"
                            aria-label="download"
                          >
                            <IconDownload size={18} />
                          </button>
                        </li>
                      </ul>
                    </dd>
                  </div>
                </dl>
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
                <span className="chat__role">
                  {tt("trackCase.overview.lawyer")}
                </span>
                <span className="chat__name">Moahmoud Mansour</span>
              </div>
            </div>

            <div className="chat__messages">
              <article className="chat__message">
                <div className="chat__date">23 Feb 2024</div>
                <h4 className="chat__title">
                  {tt("trackCase.overview.updateTitle")}
                </h4>
                <p className="chat__text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  quis augue eu purus rhoncus placerat.
                </p>
                <div className="chat__attachments">
                  <div className="chat__attachments__file">
                    <IconFileText size={18} /> ID.PDF
                    <button
                      className="chat__attachments__file-download"
                      aria-label="download"
                    >
                      <IconDownload size={18} />
                    </button>
                  </div>
                </div>
              </article>
              <article className="chat__message">
                <div className="chat__date">23 Feb 2024</div>
                <p className="chat__text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  quis augue eu purus rhoncus placerat.
                </p>
              </article>
            </div>

            <form className="chat__form" onSubmit={(e) => e.preventDefault()}>
              <label className="chat__label" htmlFor="message">
                {tt("trackCase.overview.message")}
              </label>
              <textarea
                id="message"
                className="chat__textarea"
                placeholder={tt(
                  "trackCase.overview.messagePlaceholder"
                )?.toString()}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="chat__toolbar">
                <button type="button" className="chat__attach" aria-label="attach">
                  <IconPaperclip size={18} />
                </button>
                <span className="chat__counter">{`${message.length}/500`}</span>
              </div>
              <div className="chat__actions">
                <button className="chat__btn" type="submit">
                  {tt("trackCase.overview.next")}
                </button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

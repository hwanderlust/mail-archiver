import { format, isWithinInterval } from "date-fns";
import React, { useContext, useEffect, useState } from "react";

import {
  arrowVertical,
  caretHorizontal,
  paperclip,
  logo,
  mailSenderIcon,
} from "assets/images";
import { AppContext, FetchEmails, SortEmails, ToggleModal, } from "context";
import { ChainEmail, SortOrder, SortType, } from "helpers";

import EmailWindow from "./email";
import "./emails.css";

function Emails() {
  const { state, dispatch } = useContext(AppContext);
  const [selectedEmail, setSelectedEmail] = useState<ChainEmail>();

  // init
  useEffect(() => {
    dispatch(FetchEmails());
  }, []);

  if (state.emails.length === 0) {
    return (
      <main className="emails-container--empty">
        <img className="logo--no-emails" src={logo} alt="mail archiver icon" />
      </main>
    );
  }

  function toggleViewEmail(emails?: ChainEmail) {
    setSelectedEmail(emails);
    if (emails?.length) {
      dispatch(ToggleModal(true))
    } else {
      dispatch(ToggleModal(false));
    }
  }

  return (
    <>
      <main role="table" className={`emails-container ${selectedEmail ? "hide" : ""}`}>
        <Header
          sortOrder={state.sort.order}
          sortType={state.sort.type}
          isModalOpen={state.isModalOpen}
          onSort={(sortType: SortType) => dispatch(SortEmails(sortType))}
        />
        <section>
          {state.emails.length && state.emails.map(emailChain => (
            <EmailRow
              key={emailChain[0]?.id}
              emailChain={emailChain}
              sortType={state.sort.type}
              isModalOpen={state.isModalOpen}
              onClick={toggleViewEmail}
            />
          ))}
        </section>
      </main>

      {!!selectedEmail && (
        <EmailWindow
          data={selectedEmail}
          onClose={() => toggleViewEmail()}
        />
      )}
    </>
  );
}

interface HeaderProps {
  sortOrder: SortOrder;
  sortType: SortType;
  isModalOpen: boolean;
  onSort: (type: "from" | "to" | "subject" | "date") => void;
}

function Header(props: HeaderProps) {
  const { sortOrder, sortType, isModalOpen, onSort } = props;
  return (
    <header className="emails__header">
      <h2
        role="columnheader button"
        className={`header__category ${sortType === "from" ? "bold" : ""}`}
        tabIndex={isModalOpen ? -1 : 0}
        onKeyPress={_ => onSort("from")}
        onClick={() => onSort("from")}>
        From
          {sortType === "from" && (
          <SortArrow order={sortOrder} />
        )}
      </h2>
      <h2
        role="columnheader button"
        className={`header__category ${sortType === "to" ? "bold" : ""}`}
        tabIndex={isModalOpen ? -1 : 0}
        onKeyPress={_ => onSort("to")}
        onClick={() => onSort("to")}>
        To
          {sortType === "to" && (
          <SortArrow order={sortOrder} />
        )}
      </h2>
      <h2
        role="columnheader button"
        className={`header__category ${sortType === "subject" ? "bold" : ""}`}
        tabIndex={isModalOpen ? -1 : 0}
        onKeyPress={_ => onSort("subject")}
        onClick={() => onSort("subject")}>
        Subject
          {sortType === "subject" && (
          <SortArrow order={sortOrder} />
        )}
      </h2>
      <h2
        role="columnheader button"
        className={`header__category ${sortType === "date" ? "bold" : ""}`}
        tabIndex={isModalOpen ? -1 : 0}
        onKeyPress={_ => onSort("date")}
        onClick={() => onSort("date")}>
        Date
          {sortType === "date" && (
          <SortArrow order={sortOrder} />
        )}
      </h2>
    </header>
  );
}

interface EmailRowProps {
  emailChain: ChainEmail;
  sortType: SortType;
  isModalOpen: boolean;
  onClick: (emails: ChainEmail) => void;
}

function EmailRow(props: EmailRowProps) {
  const { emailChain, sortType, isModalOpen, onClick } = props;
  const latestEmail = emailChain[emailChain.length - 1];
  const date = new Date(latestEmail.date);

  const to = latestEmail?.to?.reduce((acc, address) => acc.concat(address), "") || latestEmail?.cc?.reduce((acc, address) => acc.concat(address), "") || "";

  return (
    <div
      role="row button"
      className="email__row"
      tabIndex={isModalOpen ? -1 : 0}
      onKeyPress={_ => onClick(emailChain)}
      onClick={() => onClick(emailChain)}>

      <MobileMailIcon />

      <span
        role="cell"
        className={`from ${sortType === "from" ? "bold" : ""}`}>
        {latestEmail.from}
      </span>

      <span
        role="cell"
        className={`to ${sortType === "to" ? "bold" : ""}`}>
        {to}
      </span>

      <span role="cell" className="num">
        <Repeater emailChain={emailChain} />
      </span>

      <span
        role="cell"
        className={`subject ${sortType === "subject" ? "bold" : ""}`}>
        {latestEmail.subject}
      </span>

      <span role="cell" className="attachment">
        {latestEmail.attachment && (
          <img
            className="attachment__img"
            src={paperclip}
            alt="attachment icon - paperclip"
          />
        )}
      </span>

      <span
        role="cell"
        className={`date ${sortType === "date" ? "bold" : ""}`}>

        {/* would actually be 'isToday(date)' */}
        {isWithinInterval(date, {
          start: new Date("Jan 2 2020 00:00:00"),
          end: new Date("Jan 2 2020 23:59:59")
        }) ? format(date, "H:mm") : format(date, "MMM dd")}

        <Caret />
      </span>
    </div>
  );
}

function MobileMailIcon() {
  return (
    <span className="mail-icon__container">
      <img className="mail-icon" src={mailSenderIcon} alt="envelope icon, arrow pointing down to empty circle indicating sending to someone" />
    </span>
  );
}

function Caret() {
  return (
    <span className="right-arrow">
      <img src={caretHorizontal} alt="right arrow or caret indicating more content" />
    </span>
  );
}

function Repeater({ emailChain }: { emailChain: ChainEmail }) {
  if (!emailChain.length || emailChain.length === 1) return null;
  const latestEmail = emailChain[0];

  if (emailChain.filter(email =>
    email.subject === latestEmail.subject).length <= 1) {
    return null;
  }

  return (
    <span className="num__icon">
      +{emailChain.length - 1}
    </span>
  );
}

function SortArrow({ order }: { order: SortOrder }) {
  if (order === null) return null;

  return (
    <div className="sort-arrow__container">
      <img
        className={`sort-arrow ${order === "desc" && "rotate-down"}`}
        src={arrowVertical}
        alt="arrow pointer indicating sort order, whether ascending or descending or no sort" />
    </div>
  );
}

export default Emails;
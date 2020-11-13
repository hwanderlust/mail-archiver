import React, { ReactNode, useEffect, useRef } from "react";

import { caretHorizontal, paperclip } from "assets/images";
import { ChainEmail, Email as IEmail } from "helpers";

interface EmailProps {
  data?: ChainEmail;
  onClose: () => void;
}

function Email(props: EmailProps) {
  const { data, onClose } = props;
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    container.current?.classList.add("slide-in");
  }, []);

  if (!data) {
    console.error("Couldn't find email.");
    return null;
  }

  function handleClose() {
    container.current?.classList.remove("slide-in");
    container.current?.classList.add("slide-out");

    setTimeout(() => {
      onClose();
    }, 250);
  }


  return (
    <Modal onClose={handleClose}>
      <div className="email__container" ref={container}>
        <BackButton onClick={handleClose} />

        <h1 className="email__subject">{data[0].subject}</h1>

        {data.map(email => (
          <article className="email__article" key={`openedEmail${email.id}`}>
            <Header email={email} />
            <main className="article__body">
              {email.body}
            </main>
          </article>
        ))}
      </div>
    </Modal>
  )
}

function Modal({ children, onClose }: { children: ReactNode, onClose: () => void }) {

  return (
    <div className="email__modal">
      <div className="modal__underlay" onClick={onClose}></div>
      {children}
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="email__close-btn"
      autoFocus
      onClick={onClick}>
      <img src={caretHorizontal} alt="left arrow indicating to go back" />
    </button>
  );
}

function Header({ email }: { email: IEmail }) {
  return (
    <header>
      <h2 className="article__from">{email.from}</h2>
      <h3 className="article__to">
        <label>to </label>
        {email.to.map(address =>
          <span key={`openedEmail-header-to${address}`}>{address}</span>
        )}
      </h3>
      <h4 className="article__cc">
        {email.cc.length
          ? (
            <>
              <label>cc: </label>
              {email.cc.map(address =>
                <span key={`openedEmail-header-cc${address}`}>
                  {address}
                </span>
              )}
            </>
          )
          : ""}
      </h4>
      <span className="article__attachment">
        {email.attachment ? (
          <>
            <img
              className="email__attachment"
              src={paperclip}
              alt="attachment icon - paperclip" />
            <span>attachment name</span>
          </>
        ) : ""}
      </span>
    </header>
  );
}

export default Email;
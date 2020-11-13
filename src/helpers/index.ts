export interface State {
  sort: SortState;
  emails: Emails;
  isModalOpen: boolean;
}
export interface SearchState {
  startDate: Date;
  endDate: Date;
}
interface SortState {
  order: SortOrder;
  type: SortType;
}
export type SortOrder = "asc" | "desc" | null;
export type SortType = "from" | "to" | "subject" | "date" | null;

export type Emails = Array<ChainEmail>;
export type ChainEmail = Array<Email>;
export interface Email {
  id: string;
  from: string;
  to: Array<string>;
  cc: Array<string>;
  subject: string;
  body: string;
  date: string;
  attachment: boolean;
}

interface Cache {
  [key: string]: {
    count: number,
    emails: ChainEmail;
  }
}

/**
 * Takes original raw email data and groups emails with the same subject
 */
function groupRepeatingEmails(emails: Emails): Emails {
  const cache: Cache = {};

  for (let index = 0; index < emails.length; index++) {
    const emailChain = emails[index];
    const email = emailChain[emailChain.length - 1];

    // first encounter, add to cache
    if (!cache[email.subject]) {
      cache[email.subject] = { count: 1, emails: emailChain };
      continue;
    }

    cache[email.subject].count++;
    cache[email.subject].emails.push(...emailChain);
  }

  return Object.entries(cache).map((values) => values[1].emails);
}

/**
 * The order goes from 'asc' --> 'desc' --> null
 */
function nextSortState(current: SortState, triggeredType: SortType): [SortOrder, SortType] {
  if (triggeredType !== current.type) return ["asc", triggeredType];

  if (current.order === null) return ["asc", triggeredType];
  if (current.order === "asc") return ["desc", triggeredType];
  return [null, null];
}

function sortEmailChainsByDate(emails: Array<Array<Email>>): Array<Array<Email>> {
  return emails.map(emailChain => {
    const copy = [...emailChain];
    if (emailChain.length > 1) {
      copy.sort((a, b) =>
        new Date(a.date).valueOf() - new Date(b.date).valueOf()
      );
    }
    return copy;
  });
}

function sortEmailsByDate(emails: Array<Array<Email>>): Array<Array<Email>> {
  const sortedEmails = [...emails];
  sortedEmails.sort((chainA, chainB) =>
    new Date(chainB[chainB.length - 1].date).valueOf() - new Date(chainA[chainA.length - 1].date).valueOf()
  );
  return sortedEmails;
}

function sortEmailsByType(sortState: SortState, emails: Emails): Emails {
  // default sorting
  if (sortState.order === null) {
    return sortEmailsByDate(emails);
  }

  if (sortState.type === null) return emails;

  return [...emails].sort((chainA, chainB) => {
    // @ts-ignore preceding if-check resolves (ln 70)
    let a = chainA[chainA.length - 1][sortState.type] as string;
    // @ts-ignore preceding if-check resolves (ln 70)
    let b = chainB[chainB.length - 1][sortState.type] as string;

    if (sortState.type === "to") {
      // use 'to' addresses, otherwise 'cc'
      a = chainA[chainA.length - 1].to?.reduce((acc, address) => acc.concat(address), "") || chainA[chainA.length - 1].cc?.reduce((acc, address) => acc.concat(address), "");
      b = chainB[chainB.length - 1].to?.reduce((acc, address) => acc.concat(address), "") || chainB[chainB.length - 1].cc?.reduce((acc, address) => acc.concat(address), "");
    }

    if (sortState.type === "date") {
      if (sortState.order === "asc") {
        return new Date(b).valueOf() - new Date(a).valueOf();
      }
      return new Date(a).valueOf() - new Date(b).valueOf();
    }

    if (sortState.order === "asc") {
      return a.localeCompare(b);
    }
    return b.localeCompare(a);
  });
}

export {
  groupRepeatingEmails,
  nextSortState,
  sortEmailChainsByDate,
  sortEmailsByDate,
  sortEmailsByType
}
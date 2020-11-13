import { Emails, SortType } from "helpers";

export type Actions =
  | IFetchEmails
  | IFilterEmailsByDates
  | ISortEmails
  | IToggleModal;

interface IFetchEmails {
  type: "FETCH_EMAILS";
  payload?: { emails?: Emails };
}
function FetchEmails(payload?: { emails?: Emails }): IFetchEmails {
  return { type: "FETCH_EMAILS", payload };
}

interface IFilterEmailsByDates {
  type: "FILTER_EMAILS_BY_DATES";
  payload: { startDate: Date, endDate: Date, emails?: Emails };
}
function FilterEmailsByDates(startDate: Date, endDate: Date): IFilterEmailsByDates {
  return { type: "FILTER_EMAILS_BY_DATES", payload: { startDate, endDate } };
}

interface ISortEmails {
  type: "SORT_EMAILS";
  payload: { sortType: SortType };
}
function SortEmails(sortType: SortType): ISortEmails {
  return { type: "SORT_EMAILS", payload: { sortType } };
}

interface IToggleModal {
  type: "TOGGLE_MODAL";
  payload: { modalState: boolean };
}
function ToggleModal(modalState: boolean): IToggleModal {
  return { type: "TOGGLE_MODAL", payload: { modalState } };
}

export { FetchEmails, FilterEmailsByDates, SortEmails, ToggleModal }
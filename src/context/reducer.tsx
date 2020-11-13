import { isWithinInterval } from "date-fns";

import {
  State,
  groupRepeatingEmails,
  nextSortState,
  sortEmailChainsByDate,
  sortEmailsByDate,
  sortEmailsByType,
} from "helpers";
import { Actions } from "./actions";

function reducer(state: State, action: Actions) {
  switch (action.type) {

    case "FETCH_EMAILS": {
      if (!action.payload?.emails) return state;
      // in dev builds, after app loading if you search for emails w/o dates, 
      // this will yield in 2x repeating emails via 'groupRepeatingEmails' 
      // because the reducer is called twice per below link
      // https://github.com/facebook/react/issues/16295#issuecomment-610098654
      return {
        ...state,
        emails: groupRepeatingEmails(action.payload.emails),
      }
    }

    case "FILTER_EMAILS_BY_DATES": {
      if (!action.payload.emails) return state;

      const { startDate, endDate, emails } = action.payload;
      const filteredEmails = emails.filter(emailChain =>
        emailChain.some(email =>
          isWithinInterval(new Date(email.date), {
            start: startDate,
            end: endDate
          })
        )
      );
      const groupedEmails = groupRepeatingEmails(filteredEmails);

      if (state.sort.order && state.sort.type) {
        return {
          ...state,
          emails: sortEmailsByType(state.sort, groupedEmails)
        }
      }

      // default sorting
      let sortedEmails = groupedEmails;
      sortedEmails = sortEmailChainsByDate(sortedEmails);
      sortedEmails = sortEmailsByDate(sortedEmails);
      return { ...state, emails: sortedEmails };
    }

    case "SORT_EMAILS": {
      const [nextSortOrder, nextSortType] = nextSortState(state.sort, action.payload.sortType);

      return {
        ...state,
        emails: sortEmailsByType({
          order: nextSortOrder,
          type: nextSortType
        }, state.emails),
        sort: {
          order: nextSortOrder,
          type: nextSortType,
        }
      }
    }

    case "TOGGLE_MODAL": {
      return {
        ...state,
        isModalOpen: action.payload.modalState,
      }
    }

    default:
      return state;
  }
}

export default reducer;
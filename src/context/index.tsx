import React, {
  Dispatch,
  ReactNode,
  createContext,
  useReducer,
  useCallback
} from "react";

import { State } from "helpers";
import * as Actions from "./actions";
import reducer from "./reducer";

interface Store {
  state: State;
  dispatch: Dispatch<Actions.Actions>;
}

const initialState: State = {
  sort: {
    order: null,
    type: null,
  },
  emails: [],
  isModalOpen: false,
}

const AppContext = createContext<Store>({ state: initialState, dispatch: () => null });

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // middleware to asynchronously fetch email data
  const customDispatch = useCallback(async (action: Actions.Actions) => {
    switch (action.type) {
      case "FETCH_EMAILS": {
        const emails = await (await fetch("data.json")).json();
        action = { ...action, payload: { emails } };
        return dispatch(action);
      }

      case "FILTER_EMAILS_BY_DATES": {
        const emails = await (await fetch("data.json")).json();
        action.payload.emails = emails;
        return dispatch(action);
      }

      default:
        return dispatch(action);
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch: customDispatch }}>
      {children}
    </AppContext.Provider>
  );
}

const { FetchEmails, FilterEmailsByDates, SortEmails, ToggleModal } = Actions;
export {
  AppContext, Provider,
  FetchEmails, FilterEmailsByDates, SortEmails, ToggleModal
};
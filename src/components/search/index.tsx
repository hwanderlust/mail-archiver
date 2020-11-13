import { isAfter, isBefore, isSameDay, format, } from "date-fns";
import React, { useContext, useRef, useState, } from "react";
import { DayModifiers } from "react-day-picker";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import calendarSvg from "assets/images/icon_calender.svg";
import searchSvg from "assets/images/icon_search.svg";
import { AppContext, FetchEmails, FilterEmailsByDates } from "context";
import "./search.css";

function Search() {
  const { state, dispatch } = useContext(AppContext);
  const [dates, setDates] = useState<{ from: Date, to: Date }>();
  const pickerRef = useRef<DayPickerInput>();
  const pickerShown = useRef(false);

  function onSearch(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    if (!dates) {
      dispatch(FetchEmails());
      return;
    }

    const startDate = dates.from;
    const endDate = dates.to;

    if (startDate) {
      startDate.setHours(0, 0, 0);
    }

    if (startDate && !endDate) {
      dispatch(FilterEmailsByDates(startDate, new Date()));
      return;
    }

    if (startDate && endDate) {
      if (isSameDay(startDate, endDate)) {
        endDate.setHours(23, 59, 59);
        dispatch(FilterEmailsByDates(startDate, endDate));
        return;
      }

      endDate.setHours(0, 0, 0);
      dispatch(FilterEmailsByDates(startDate, endDate));
      return;
    }
  }

  function handleDayChange(day: Date, mods: DayModifiers, picker: DayPickerInput) {
    if (!pickerRef.current) {
      pickerRef.current = picker;
    }
    if (!dates?.from) {
      // @ts-ignore assigning 'to' afterwards
      setDates(prev => ({ ...prev, from: day }));
      return;
    }
    // @ts-ignore already assigned 'from' earlier
    setDates(prev => ({ ...prev, to: day }));
  }

  function handleCalendarClick() {
    if (pickerRef.current) {

      if (pickerShown.current) {
        pickerRef.current.hideDayPicker();
        pickerShown.current = false;
        return;
      }

      pickerRef.current.showDayPicker();
      pickerShown.current = true;
    }
  }

  function hidePicker() {
    if (pickerRef.current) {
      pickerRef.current.hideDayPicker();
      pickerShown.current = false;
    }
  }

  return (
    <>
      <div className="search">
        <div className="search__date">
          <CalendarIcon onClick={handleCalendarClick} />

          {/* https://github.com/gpbl/react-day-picker/issues/1031  */}
          <DayPickerInput
            style={{ display: "inline-flex", flex: 1 }}
            component={(props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLInputElement> & React.InputHTMLAttributes<HTMLInputElement>) => (
              <input
                {...props}
                className={`${props.className} day-picker__input`}
                tabIndex={state.isModalOpen ? -1 : 0}
              />
            )}
            placeholder=""
            hideOnDayClick={dates ? dates.from && dates.to && true : false}
            value={!dates ? "" :
              `${dates.from ? format(dates.from, "yyyy/M/d") : ""} - ${dates.to ? format(dates.to, "yyyy/M/d") : ""}`
            }
            dayPickerProps={{
              selectedDays: handleSelectedDates(dates),
              disabledDays: day => handleDisabledDays(day, dates),
              onBlur: event => handleCalendarBlur(event, hidePicker),
            }}
            onDayChange={handleDayChange}
            onDayPickerShow={() => { if (dates && dates.from && dates.to) setDates(undefined); }}
          />
        </div>

        <SearchButton
          isModalOpen={state.isModalOpen}
          handleSubmit={onSearch}
        />
      </div>
      <ResultsTitle numOfEmails={state.emails.length} />
    </>
  );
}

function CalendarIcon({ onClick }: { onClick: () => void }) {
  return (
    <button className="date__calendar" onClick={onClick}>
      <img
        className="search__icon"
        src={calendarSvg}
        alt="calendar icon" />
    </button>
  );
}

interface SearchButtonProps {
  isModalOpen: boolean;
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
function SearchButton({ isModalOpen, handleSubmit }: SearchButtonProps) {
  return (
    <button
      className="search__button"
      tabIndex={isModalOpen ? -1 : 0}
      onClick={handleSubmit}>
      <img
        className="search__icon"
        src={searchSvg}
        alt="search icon" />
    </button>
  );
}

function ResultsTitle({ numOfEmails }: { numOfEmails: number }) {
  return (
    <>
      <h1 className="results">
        <span>Results: </span>
        <span className="results__num">{numOfEmails}</span>
        <span> mail(s)</span>
      </h1>
      <div className="results__line"></div>
    </>
  );
}

/**
 * Hides the calendar picker if a ref is available; only available after having selected a date at least once
 */
function handleCalendarBlur(
  event: React.FocusEvent<HTMLDivElement>, onHide: () => void
): void {
  const targetClasses = Array.from(event.target.classList);
  if (targetClasses.includes("DayPicker-Day--selected") || targetClasses.includes("DayPicker-NavButton")) {
    return;
  }
  onHide();
}
/**
 * Disables
 * -days before the start date
 * -days after the end date
 */
function handleDisabledDays(day: Date, dates: { from: Date, to: Date } | undefined): boolean {
  if (!dates || (dates && !dates.from && !dates.to)) {
    return isAfter(day, new Date());
  }
  if (dates && dates.from && !dates.to) {
    return isBefore(day, dates.from) || isAfter(day, new Date());
  }
  return false;
}
/**
 * ensures first selected date renders with selected styling
 */
function handleSelectedDates(dates: { from: Date, to: Date } | undefined) {
  if (!dates) return undefined;

  if (dates && dates.from && dates.to) return dates;
  if (dates && dates.from && !dates.to) return [dates.from];

  return undefined;
}

export default Search;
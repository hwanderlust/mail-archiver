# Report
> ...describing your efforts in the process of completing the missions above.

## Start
Analyzed the PDF with the design and immediately had questions, particularly with the purpose of the `+1` and `+2`. Since the email beginning with `RE:` didn't have one, it led me to believe its purpose was for only repetitive emails, but it also felt misleading and because of the uncertainty, it was an anxious progress building the clone app.

I noticed the dates and the formatting differences, so I immediately decided on using `date-fns` because as anyone working with Javascript knows, working with dates in JS can be not-fun. It's a small package after all and it makes development so much smoother :)

## Development

### Date Input
This was a pain point because there were no instructions, goals or points to cover. I started out with a regular text input with plenty of user validations, but then changed gears to `<select>` to confine and control what the user inputs would be; plus they're both keyboard-accessible-friendly.

Then I realized the inclusion of the calendar icon meant the user would be expecting a calendar UI to select dates from. Then I realized there was no restriction from pulling in an external package or API to utilize; it was only a matter of finding one with a matching design since the whole point was to deliver a `high-fidelity` copy.

Unfortunately there's a bug with using the keyboard with their API. After having a look at their code, it's mostly complete and you can tell they built it with accessibility in mind but there's just a minor gap in logic preventing the keyboard from accessing the inside of the calendar when it's rendered on the DOM. If you click on the calendar with the mouse, then you can navigate via the keyboard though.

Having gone through these changes, I made the executive decision to timebox this whole development and won't pursue perfection in this area. Obviously, if it came to this on the job, I'd consult with my manager and teammates during standup or during work hours to see how best to move forward.

### Data
Before the start of development, I worked out the details of how'd the email raw data might come from the backend. Knowing the data structures and the format of the JSON greatly minimizes any further necessary changes to the elements and implementation of the design.

This isn't always the case when working at an organization or on a team, but it's definitely the priority when being tasked with such a feature/task -- connecting with the team/individual creating the API or finding the docs.

### Table
A glance at the design and one could tell you could start off with using `<table>` but we know it isn't very flexible and we'd like to minimize having to have separate markup for varying views (mobile, desktop, tablet, and everything in between). I could be wrong, so I spent a little bit of time reviewing MDN and other online resources to confirm my assumption.

Then my next thought went to CSS Grid, of course. It was just a matter of making it accessible for screen-readers and whatnot, so I looked into the proper syntax for all the relating `roles`. The implementation took a little bit of fiddling with for the best markup and styling to match the design perfectly, but I got there! Always have to keep refactoring and simplifying implementations so that I can come back in the future and not be lost!

### Mission 2
> Assignment: In the search result section, extend the UI mockup so that user can inspect the body of each emails from the search result.

The `inspect the body of each emails` section through me for a turn after re-reading it after implementing the design. Two possibilities came to mind:
1. The ability to select multiple emails
2. The ability to see a thread or a chain of emails for a singular row on the default UI

I believed the latter to be correct and proceeded accordingly. There was no restrictions of what or how far we should go with the implementation or design of this feature. I decided on a design that more-or-less matched the original design and something simple, consistent with what was provided.

Though I figured transitions were necessary for UX! Thought about bringing in `react-transition-group` but it was too much for a simple implementation.


## Conclusion
This was a fun challenge and I always approve of such challenges because this is for a frontend developer role after all! And there's no better way to determine one's abilities and compatibility than with their submitted code. And by providing a specific and limited task, you can easily compare one candidate with another.

A difficult part was determining how far I should go and what was allowed and what wasn't. This is all part of the planning process when it comes to sprints and you're able to figure this out with the creator of the ticket/card and with your team and can split, limit or switch things around for the best approach and end result. Without this, it was a constant battle of self-reflection and trying to prevent myself from getting carried away with something and going on a tangent.

With all of that said, I hope I was able to accurately discern what the tasks and missions were and accomplish them to your liking! It was a fun time, and I'm looking forward to hearing back from you -- one way or another. By the way, I'd love to hear your thoughts on my work! :)
# Improvements
> Assignment: From the provided design, state your opinion on UI parts that can be improved, including the reason why and how you would improve them.

1. The line stating how many emails or `results` there are is already dynamic in terms of the amount, might as well dynamically change the plurality of the word as well instead of the catch-all "(s)". It just looks better from a design aspect and it isn't costly (network or memory-wise).

2. This type of app seems to be more on the lines of a general mail app or something like Microsoft's Outlook and so having a filter for the connected email accounts is ideal for user experience. Because of both `from` and `to` columns, everything feels cluttered and noisy. When filtering for the `to` email addresses, we can remove that column temporarily and immediately everything is much more easily digestible, information-wise.

3. In the provided design PDF, `［dev］ Postfix 3.1.12 / 3.2.9 / 3.3.4 / 3.4.5` has a space in the front. I kept it because the given "mission" was essentially to recreate the design to a T and so I did. With that said, it's also our job to always check, confirm and enforce user inputs. It's not difficult to trim off extra space either when the backend receives it or when we go to display it in our app. It definitely would maintain consistency and align things up beautifully!

4. The obvious and dire improvement would be color -- we can totally spice this up with color! It's way too boring, which may be intended because it's a email client, but it shouldn't be like that. While features and functionality may keep users coming back, it's definitely the design and UX which first grabs the user's attention in the first place! Should never underestimate design's role.

5. Pertaining to the mobile view of the provided design, there's no need to squeeze the sorting categories in the gray container. Despite the pipes `|` and the shade of black/gray helps to separate the components, there's still available space so we can increase that space or even spread them out evenly across which would also--depending on implementation--prevent the shifting of DOM elements when initiating a sort with the arrow/pointer icon.

There's plenty of other improvements in terms of functionality and features, many of which are obvious, but the above are purely based on the design.
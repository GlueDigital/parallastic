# Parallastic

A simple helper to make parallax and scroll effects easier.

## Demo

Usage demo:
> import parallastic from 'parallastic'<br>
> const handler = parallastic()<br>
> handler.addProportional(document.body, 0, 100, 'opacity', 1, 0, {units: '%'})

## Usage guide

### Constructor
Initializes the library and returns the handler used to add events to it.

Args:
 - scrollable: The element which we will watch for scroll events. Defaults to window, but if you want effects to trigger with some internal scroll, just pass your *overflow:scroll* div instead.

Example:
> const handler = parallastic(document.getElementById('someDiv'))

### addToggler
Adds a new event that toggles a class when a element reaches a certain point on the window.

Args:
 - target: The element whose position we'll consider
 - className: The class that will be added
 - position: The percentage of the viewport height (as a value between 0 and 100) at which the change will be triggered
 - opts: Object with other options:
    - reverse: Whether or not the class should be removed on opposite direction scroll
    - classTarget: The element that receives the class (defaults to target)

Example:
 > handler.addToggler(document.getElementById('header'), 'fixed', 0, {reverse: true})

### addProportional
Adds a new event that makes a change to some property proportionally to the scrolled amount.

Args:
 - target: The element which will change
 - yStart: The scroll position where effect starts
 - yEnd: The scroll position where effect ends
 - property: The style property that will change
 - propertyStart: The value of *property* at *yStart*
 - propertyEnd: The value of *property* at *yEnd*
 - opts: Object with other options:
    - ref: Element relative to which we'll measure the position
    - units: yStart and yEnd unit. Defaults to 'px', but '%' is allowed too
    - prefix: string added before the value when setting the property
    - suffix: string added after the value when setting the property

Example:
> handler.addProportional(document.body, 0, 100, 'opacity', 1, 0, {units: '%'})

# Cards

The base renderer for Cards API. Any game can use it.
Thats why it's in seperate directory.

For now, focus on creating React components. Each component should be dummie.

# User Events

Table should add user interaction events to every element.

Elements in containers can behave differently. Cards in Deck or Pile shouldn't emit events, because you should be able to pick only top-most element or just select the deck as you action.

Elements which are clearly visible and selectable in the container (like Hand or Row) should report to their Container first. Only Container should be allowed to send action request to a game.

Example event data, when user picks a card from his hand:

```
{
  player: player.id,      // Which player requests an action
  reporter: container.id, // Which container/element reports user interaction
  element: card.id,       // Which element is desired by the player
}
```

Another example for clicking a deck of cards (regardless of the card element):

```
{
  player: player.id,
  reporter: container.id,
  element: container.id,
}
```

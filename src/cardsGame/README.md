# Cards

The base renderer for Cards API. Any game can use it.
Thats why it's in seperate directory.

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

# Positioning elements in and out of containers

Every element can have its position defined by the game in server AND on client-side.

Containers and Cards placed on the table can be offset from the center, creating unique play area.

Cards could be placed just on the table, without the need of creating new container to hold that one card.

Cards can have their client-side position affected by a container they're sitting in. For example, Deck must look like a real, neatly packed stack of cards, hence Deck will change its cards position every time this container gets a new card to hold. Should the card's x/y position be included while rendering a stack of cards?

There are two ways to solve this problem:

a) x and y values of Cards or any other element are ignored while they're inside any Container
b) You (cards game creator) are responsible of x/y position of every card while moving them between parents/table

For now, I chose option A), I'm curious how this library will take shape in the future and make changes when needed.

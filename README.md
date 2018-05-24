# Tetris

A simple Tetris game written in Javascript. 

<p align="center">Game Start</p>
<p align="center">
  <image width="50%" height="50%" src="https://user-images.githubusercontent.com/23227930/40473222-9299e2f8-5f09-11e8-9991-994381e800b0.png" alt="start screen" />
</p>

<p align="center">Middle of a Game</p>
<p align="center">
  <image width="50%" height="50%" src ="https://user-images.githubusercontent.com/23227930/40473225-94e34446-5f09-11e8-965b-922c0720d73e.png" alt="in-game" />
</p>

## Scoring

The game uses the original Tetris scoring system for Nintendo's NES, that is:

Level | 1 Line Cleared | 2 Lines Cleared | 3 Lines Cleared | 4 Lines Cleared
:---: | :------------: | :-------------: | :-------------: | :-------------:
0     | 40             | 100             | 300             | 1200
1     | 80             | 200             | 600             | 2400
...   |                |                 |                 |
9     | 400            | 1000            | 3000            | 12000
n     | 40 * (n + 1)   | 100 * (n + 1)   | 300 * (n + 1)   | 1200 * (n + 1)

## Floating Blocks

The game uses floating mechanism for blocks instead of chain-reaction when lines of blocks are cleared. This is done intentionally to increase game difficulty at high levels.

## "Bag" Random Generator

The game implements "bag" random generator to ensure every type of block will occur once and exactly once every 7 moves (as there are a total of 7 block types). Refer to [wiki][wiki page] page for more details.

## License

Copyright (c) 2018 Yi Zhang

Licensed under the [MIT](LICENSE) License.

[wiki page]: https://github.com/YiZhang-Paul/Tetris/wiki "Wiki"

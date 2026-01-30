# Flappy Bird Clone (Phaser.js)

A browser-based Flappy Bird–style game built with **Phaser 3** using Arcade Physics.  
The project focuses on clean game-loop design, scalable difficulty progression, and practical use of Phaser’s scene, physics, and timing systems.

This is a first release intended to be readable, hackable, and easy to extend without unnecessary abstraction.

---

## Description

This project implements a complete Flappy Bird–style arcade game using Phaser.js.  
It includes infinite obstacle generation, progressive difficulty scaling, collision detection, scoring, a game-over state, restart logic, and a responsive fullscreen layout.

The code favors explicit state management and engine-native features over custom abstractions, making it suitable for developers who want a clear reference implementation or a solid base for experimentation.

Main game logic lives in [`app.js`](./app.js), with a minimal bootstrap in [`index.html`](./index.html).

---

## Technical Highlights

- **Phaser Arcade Physics** for gravity, collision detection, and lightweight rigid body simulation  
  https://phaser.io/phaser3/devlog/121

- **Object pooling** for pipes using `Physics.Arcade.Group`, avoiding frequent allocations and improving runtime stability  
  https://phaser.io/docs/3.55.2/Phaser.Physics.Arcade.Group.html

- **Timer-driven spawning** using `Scene.time.addEvent` rather than frame-based logic  
  https://phaser.io/docs/3.55.2/Phaser.Time.Clock.html#addEvent

- **Progressive difficulty scaling** by dynamically adjusting pipe speed, spawn delay, and gap size over time

- **Depth-based render ordering** (`setDepth`) to guarantee UI elements always render above gameplay objects  
  https://phaser.io/docs/3.55.2/Phaser.GameObjects.Components.Depth.html

- **Scene restart pattern** to reset all game state cleanly without manual teardown  
  https://phaser.io/docs/3.55.2/Phaser.Scenes.ScenePlugin.html#restart

- **Responsive fullscreen layout** using Phaser’s scale manager with `RESIZE` and `CENTER_BOTH`  
  https://phaser.io/docs/3.55.2/Phaser.Scale.ScaleManager.html

---

## Technologies & Libraries

- **Phaser 3** — HTML5 game framework  
  https://phaser.io/

- **HTML5 Canvas rendering** via Phaser’s WebGL/Canvas fallback system  
  https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

- **JavaScript (ES6+)** — arrow functions, block scoping, closures  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript

- **Phaser Arcade Physics Engine** — chosen for simplicity and performance over Matter.js  
  https://phaser.io/phaser3/devlog/92

---

## Project Structure

```text
.
├── index.html
├── app.js
├── assets/
│   ├── background.png
│   ├── road.png
│   ├── column.png
│   └── bird.png

Directory Notes-

assets/
Contains all image assets used by the game. Assets are loaded during the preload phase and reused via object pooling to minimize runtime overhead.

app.js
Main game entry point. Defines the Phaser configuration, scene lifecycle (preload, create, update), physics setup, pipe spawning logic, scoring, difficulty scaling, and game-over handling.

index.html
Minimal bootstrap file responsible for loading Phaser and initializing the game canvas.

Design Notes-

The game intentionally avoids additional frameworks beyond Phaser to keep the runtime surface small.

Logic is implemented in a single scene for clarity; splitting into multiple scenes (Boot, Game, UI) is a straightforward extension.

Difficulty progression is time-based rather than score-based to maintain consistent pacing.

Explicit state flags (e.g., isGameOver) are preferred over implicit physics conditions for readability and maintainability
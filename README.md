# Disclaimer

I do not own the copyright for the assets used in this mod, copyright holders are the ones credited just above. I made this unofficial mod so the game can be discovered by new people. If you like Voice of Cards please consider buying it at your local store, Steam or Nintendo eShop.

# Colyseus Card Sets Game

A clone from the Game Parlor game from Voice of Cards

# Template
I am using the template from https://ubershmekel.github.io/vite-phaser-ts-starter/

## Get Started

1. Clone this repo
2. Run `npm install`
3. Run `npm run dev`
4. Click `localhost:3000` to see the game.

```
{
  "scripts": {
    "dev": "vite", // start dev server
    "build": "vite build", // build for production
    "serve": "vite preview" // locally preview production build
  }
}
```

## Why this tech stack

I looked at quite a few web game frameworks. I settled on this setup because:

* Phaser is the most prominent web game framework, with a lot of examples for pretty much every scenario.
* Typescript lets me auto-complete everything and makes sure I avoid silly typo bugs.
* Vite is much faster and simpler than Rollup and Webpack. I practically didn't have to do anything to get Phaser to work here, there's no complicated config file. The development-build-refresh cycle seems instant. It's fast enough that I never felt the need to measure it. Vite was built by evanw@ the person that built Vue.js.

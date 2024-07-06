# The Odin Project - Javascript Calculator

This is a solution to [Project: Calculator](https://www.theodinproject.com/lessons/foundations-calculator) for The Odin Project. [The Odin Project](https://www.theodinproject.com/about) provides a free open source coding curriculum that can be taken entirely online.

Project: Calculator is the final project in the Foundations Course.

### Built with

- HTML + CSS
- Javascript 
- Designed in Figma
- Flowchart with Miro (free version)

### Project Links

- Git repo: https://github.com/thebcrayon/odin-calculator
- Live preview: https://thebcrayon.github.io/odin-calculator/

### Changelog

This project will likely not get updated.

## What I learned

This project was so much fun and was an extremely satisfying payoff in putting everthing together from the Foundations Course. I ran into a lot of holes in my logic early on which led to a very rewarding session of flowcharting where I found out the error in my approaches.

My initial logical approach lead to deeply nested (and confusing) `if/else` statements, where I quickly lost track of which user input condition I was accouting for.

Continued flowcharting led to the final logical approach of storing `currentButton` and `previousButton` information inside an ojbect, then looking at the `previousButton` information to determine the logical steps to take with the `currentButton`:

```js
const calcExp = {
  operandA: undefined,
  operandB: undefined,
  operator: undefined,
  currentButton: undefined,
  prev_operandB: undefined,
  prev_operator: undefined,
  previousButton: undefined,
  clear: function () {
    this.operandA = undefined;
    this.operandB = undefined;
    this.operator = undefined;
    this.currentButton = undefined;
    this.prev_operator = undefined;
    this.prev_operandB = undefined;
    this.previousButton = undefined;
  },
}
``` 
## About Me

I'm Justin, a freelance Designer/Animator by trade but designing and developing scripts/templates for After Effects has ignited a deep interest in frontend/backend technologies. I'm naturally curious so learning full stack development through [The Odin Project](https://www.theodinproject.com/about) has been nothing but pure joy.

### What I'm currently learning
[The Odin Project - Full Stack Ruby on Rails](https://www.theodinproject.com/paths/full-stack-ruby-on-rails)

### Socials

- [Design + Animation Portfolio](https://www.thebrowncrayon.com/)
- [Instagram](https://www.instagram.com/thebcrayon/)
- [LinkedIn](https://www.linkedin.com/in/thebrowncrayon/)
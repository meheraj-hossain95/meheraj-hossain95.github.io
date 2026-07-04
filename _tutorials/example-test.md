---
layout: article
title: "Demo Article: All the Building Blocks"
description: "Sandbox"
date: 2026-07-04
---

This file is a **reference sheet**, not a real post. Copy whichever block you need when drafting a new article. Delete this file (or keep it out of your collection's published list) once you don't need it anymore.

## Headings

Use `##` for section headings inside the body — they'll pick up your uppercase, letter-spaced `h2` style automatically.

### A smaller heading

`###` still renders (browser default h3) but you have no custom CSS for it yet — see note at the end if you want one.

## Paragraphs, emphasis, links

Plain paragraph text flows here. You can use **bold**, *italic*, or ***both***. Inline `code like this` uses monospace. Here's a [link to somewhere](https://example.com) styled in your blue accent color.

## Lists

Unordered:

- First point
- Second point
  - Nested point
- Third point

Ordered:

1. Step one
2. Step two
3. Step three

## Blockquote

> This is a blockquote. Good for pull quotes, citations, or highlighting a key idea from a source you're referencing.
>
> — Someone, somewhere

## Table

| Model | Params | Release |
|---|---|---|
| GPT-2 | 1.5B | 2019 |
| GPT-3 | 175B | 2020 |
| Claude Sonnet 5 | — | 2025 |

## Code block (with syntax highlighting)

```python
def softmax(x):
    exp_x = [pow(2.718281828, i) for i in x]
    total = sum(exp_x)
    return [i / total for i in exp_x]
```

```javascript
const greet = (name) => `Hello, ${name}!`;
console.log(greet("world"));
```

## Dropdown / collapsible box

<details class="note-box">
  <summary>Click to expand: why this matters</summary>
  <p>This is the plain in-article dropdown style — not the uppercase TOC accordion. Use it for asides, proofs, extra detail, or spoilers you don't want cluttering the main flow.</p>
</details>

## Image

![Alt text describing the image](https://via.placeholder.com/800x400)

*Caption text goes here, if you want one — see note at bottom for caption styling.*

## Horizontal rule (thin, mid-article)

Use this to separate sections without a full heading break.

<hr class="thin">

Text continues after the thin rule.

## Footnote-style reference

Here's a claim that needs a source.[^1]

[^1]: This is the footnote content, rendered at the bottom of the page by Kramdown automatically.
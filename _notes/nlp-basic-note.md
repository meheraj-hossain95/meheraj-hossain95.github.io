---
layout: article
title: "Text to LLM Output"
description: "Basic Note for NLP."
date: 2026-07-19
---

A transformer-based NLP system turns raw text into output through a sequence of well-documented steps, grouped below into 7 stages for clarity. Stages 1–6 are shared by essentially all transformer models; Stage 7 splits into two different pipelines depending on the task.

---

## Stage 1: Text → Tokens

The model can't read words directly — it first has to chop text into pieces called **tokens**. Tokens are usually **subword units**: smaller than a whole word, bigger than a single letter.

Example: `"unhappiness"` → `["un", "happi", "ness"]`

Why not just split on whole words? Because any word that isn't in the model's dictionary (a typo, a rare name, a made-up word) would be a dead end. By breaking words into smaller, reusable chunks, the model can always represent *any* text — even words it's never seen — by combining known fragments. This is called fixing the "out-of-vocabulary" problem.

### The main ways to build subword tokens

- **BPE (Byte Pair Encoding)** — Start with every character (or byte) separate. Look at the training text and find the pair of pieces that appears together most often, and merge them into one unit. Repeat this thousands of times until you have a vocabulary of the size you want (e.g. ~50,000 tokens for GPT-2, ~100,000 for GPT-4's tokenizer). It's a simple "merge whatever is most common" rule, originally borrowed from a 1994 data-compression algorithm. Used by the GPT family, and (via SentencePiece, see below) by LLaMA.
- **WordPiece** — Very similar to BPE — it also starts from characters and merges pairs step by step — but instead of merging the *most frequent* pair, it merges whichever pair *most improves the model's ability to predict the training text* (a likelihood-based test rather than a raw frequency count). Used by BERT and its relatives (DistilBERT, Electra).
- **SentencePiece** — Not a merge rule by itself, but a tokenizer *framework*. Its key difference: it treats the raw text as one continuous stream of characters, including spaces, instead of assuming text is already split into words. That makes it work well for languages like Japanese or Thai that don't use spaces between words at all. Internally, SentencePiece runs one of two algorithms to actually decide the vocabulary:
  - its **BPE** mode (same merge-most-frequent-pair idea, applied to raw text) — used by LLaMA
  - its **Unigram** mode — starts from a huge candidate vocabulary and repeatedly *removes* the least useful piece until it hits the target size (the opposite direction from BPE/WordPiece) — used by T5, ALBERT, XLNet, and Gemma

In short: BPE, WordPiece, and Unigram are the actual *algorithms* for deciding which pieces belong in the vocabulary. SentencePiece is a *framework* that can run the BPE or Unigram algorithm, and its defining feature is that it works on raw, unsegmented text rather than text that's already been split on spaces.

The exact tokenizer used by fully closed models (GPT-4, Claude) isn't always published in full detail, but publicly available information indicates they're BPE-family tokenizers, consistent with the rest of the field.

---

## Stage 2: Tokens → Token IDs

Once text is split into tokens, each token gets swapped for a plain number — its position in the model's vocabulary list. This is nothing new conceptually (it's just a lookup, like a word appearing at entry #4821 in a dictionary) — the only thing that changed from older NLP is that the vocabulary is made of subwords instead of whole words.

Example: `["un", "happi", "ness"]` → `[204, 8821, 119]`

---

## Stage 3: Token IDs → Vectors (Embeddings)

A plain number like `8821` doesn't tell the model anything about *meaning*. So each token ID is converted into a list of numbers — a **vector** — using a lookup table the model learned during training. Similar-meaning tokens end up with similar vectors.

This step is also where a lot of *older* NLP techniques used to do all the "meaning" work, before transformers existed:

| Method | What it does | Why it fell short |
|---|---|---|
| One-hot encoding | A vector that's all zeros except a single 1 marking which word it is | Captures no meaning at all — every word is equally "different" from every other word |
| Bag of Words (BoW) | Adds up the one-hot vectors of every word in a document into one word-count vector | Order is thrown away completely — "dog bites man" and "man bites dog" look identical |
| TF-IDF | Same as BoW, but down-weights common words (like "the") and up-weights rare, distinctive words | Still no real meaning, still no context, still ignores order |
| Static embeddings (Word2Vec, GloVe, FastText) | The first method to give each word a genuinely meaningful dense vector, learned from how words are used | Still only *one* fixed vector per word — "bank" gets the exact same vector whether it means a riverbank or a money bank |

Modern token embeddings are dense too, similar in spirit to static embeddings — but they're only the *starting point*. What makes them powerful is the next stage, where they get reshaped based on context. Static embeddings never had that.

---

## Stage 4: Positional Information

Transformers read all tokens of a sentence **at the same time**, in parallel — unlike older models like RNNs, which read one word after another in order. The upside is speed; the downside is that the model has no built-in sense of *which token came first*. So the model needs to be told, explicitly, where each token sits in the sentence.

- **Original Transformer (2017), BERT, GPT-2/GPT-3**: each position gets its own positional vector (learned, or built from a fixed sine/cosine pattern), which is simply added on top of the token's embedding before anything else happens.
- **Later models — GPT-NeoX, GPT-J, LLaMA, PaLM**: use a newer trick called **RoPE** (Rotary Positional Embeddings). Instead of adding a separate position vector at the start, RoPE works *during* attention itself — it slightly rotates the query and key vectors based on position, so the model naturally senses how far apart two tokens are.

> Correction worth knowing: GPT-3 uses the older learned-position approach, same family as GPT-2 — **not** RoPE. RoPE only became common with later models.

> The exact scheme used inside closed models like GPT-3.5/4 or Claude isn't publicly documented, so treat specific claims about those as guesses, not facts.

Without any positional signal, the model would basically see a jumbled bag of tokens instead of an ordered sentence — even Stage 3's embeddings alone don't fix that.

---

## Stage 5: Self-Attention (Transformer Layers)

This is where the actual "understanding" happens. In self-attention, every token looks at every other token in the sentence and decides how much attention to pay to each one, then updates its own vector using that information.

A simple example: in "The laptop overheated because its fan broke," the word "its" needs to figure out that it refers to "laptop." Self-attention is the mechanism that lets "its" pull in information from "laptop," even though they're several words apart. This happens for every token, across many stacked layers, each layer refining the representations further.

None of the older methods (TF-IDF, static embeddings) have any equivalent step — they have no way for one word's vector to be influenced by its neighbors. This is the single biggest reason transformers took over from everything that came before.

---

## Stage 6: Contextualized Token Representations

After passing through all the attention layers, every token ends up with a vector that reflects the *entire sentence*, not just the word itself.

So now:
- "Bank" in "I sat on the river **bank**" → one vector
- "Bank" in "I deposited money at the **bank**" → a *different* vector, even though it's the same word

That's the core upgrade over static embeddings, which would have given "bank" the exact same vector in both sentences no matter what.

---

## Stage 7: Two Branches

At this point, the pipeline splits depending on what the model is actually built to do.

**(A) Embedding / similarity use case** — used for semantic search, RAG (retrieval-augmented generation), clustering, and deduplication.
The per-token vectors from Stage 6 are squashed down into a *single* vector representing the whole sentence or document — this is called **pooling** (common approaches: averaging all token vectors, using a special `[CLS]` token's vector, or using the last token's vector). Two pieces of text can then be compared for similarity just by measuring the angle between their vectors (cosine similarity).
Examples: Sentence-BERT, E5, and the embedding APIs from OpenAI, Cohere, Google.

**(B) Generative use case** — this is what people usually mean by "an LLM": ChatGPT, Claude, LLaMA.
Instead of pooling into one vector, the model uses the Stage 6 output to predict the *next token*: it runs the vectors through an "unembedding" layer that scores every token in the vocabulary, turns those scores into a probability distribution, and samples one token as the output. That new token gets appended to the input, and the **entire pipeline runs again from Stage 1** to produce the next token — and this repeats, one token at a time, until the response is complete.

There's no single pooled sentence vector in this branch — it's a fundamentally different final step than (A), even though both branches share Stages 1–6.
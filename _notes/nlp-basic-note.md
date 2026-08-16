---
layout: article
title: "Text to LLM Output"
description: "Basic Note for NLP."
date: 2026-08-15
---

A transformer based language system does not take a sentence and immediately understand it as a human would. The text first has to be converted into a form the model can process. The model then repeatedly transforms those representations through several layers until it can either produce a useful representation of the text or predict what token should come next.

There is no single official sequence of numbered stages that every transformer model follows. Different models use different tokenizers, positional methods, transformer architectures, and output mechanisms. The numbering below is only a convenient way to understand the main steps involved.

## 1. Text → Tokens

The first important step is tokenization.

A model does not normally treat every complete word as one unit. Modern language models commonly divide text into smaller pieces called tokens. A token may be a complete word, part of a word, punctuation, whitespace information, or even a single character or byte, depending on the tokenizer.

For example:

```text
"unhappiness"
        ↓
["un", "happi", "ness"]
```

The exact result depends on the tokenizer used by the model.

The reason for using smaller pieces is simple. A vocabulary containing every possible word would become enormous, and new words are constantly appearing. Names, technical terms, spelling mistakes, abbreviations, and newly created words would also be difficult to handle with a strict whole word vocabulary.

Subword tokenization provides a practical compromise. Common words and word parts can receive their own tokens, while unfamiliar words can usually be represented by combining smaller pieces.

This greatly reduces the out of vocabulary problem.

### BPE

BPE, or Byte Pair Encoding, is one of the widely used approaches for creating subword vocabularies.

The basic idea is straightforward. It starts with small pieces and repeatedly combines pieces that commonly occur together in the training data. Over many such merges, frequently occurring sequences become individual tokens.

Modern systems can use different forms of BPE. GPT 2, for example, uses byte level BPE. This means that the tokenizer works from bytes rather than assuming that the input consists only of ordinary characters or already separated words.

It is therefore better to say that GPT style systems use the BPE family of tokenization rather than assuming that every GPT model uses exactly the same tokenizer.

### WordPiece

WordPiece is another subword tokenization method. It is closely related to BPE, but its vocabulary construction uses a different training objective.

BERT uses WordPiece tokenization.

It is also important to separate how WordPiece is trained from how it tokenizes new text. Once its vocabulary has been created, WordPiece tokenization uses a longest matching approach to find suitable pieces from that vocabulary.

For example, an unfamiliar word might be represented by several smaller pieces rather than being discarded simply because the complete word was not present in the vocabulary.

### SentencePiece

SentencePiece is slightly different because it is primarily a tokenizer framework rather than one single tokenization algorithm.

It can use algorithms such as BPE and Unigram. Its important practical feature is that it can work directly with raw text rather than requiring the text to be split into words first.

This is particularly useful for languages where spaces do not reliably separate words, such as Japanese and Chinese. SentencePiece treats the input as a sequence of characters and preserves whitespace information as part of its processing.

For example, a model can be trained with SentencePiece using either BPE or the Unigram approach. These are different ways of deciding which pieces should make up the vocabulary.

So the relationship is:

```text
BPE        → tokenization algorithm
WordPiece  → tokenization algorithm
Unigram    → tokenization algorithm

SentencePiece → framework that can implement BPE or Unigram
```

Different model families use different choices. BERT uses WordPiece, while models such as T5 have used SentencePiece with the Unigram approach, and LLaMA uses a SentencePiece based BPE tokenizer.

The tokenizer is trained separately from the main language model and its vocabulary becomes part of the model's overall setup. A different tokenizer can divide exactly the same sentence into a different sequence of tokens.

## 2. Tokens → Token IDs

After the text has been divided into tokens, the model still cannot directly work with the token strings.

Each token is assigned an integer ID from the model's vocabulary.

For example:

```text
["un", "happi", "ness"]
        ↓
[204, 8821, 119]
```

The numbers themselves do not contain meaning. They simply identify entries in the model's vocabulary.

You can think of the vocabulary as a large lookup table. When the tokenizer produces a token, the model looks up the corresponding ID.

Special tokens may also be added at this point depending on the model. These can represent things such as the beginning or end of a sequence, padding, or other model specific instructions.

For conversational models, there can also be another layer of formatting before tokenization. A chat system may convert separate system, user, and assistant messages into a particular sequence of text and special tokens that the model has been trained to understand.

This means that what reaches the tokenizer is not always just the exact sentence typed by the user.

## 3. Token IDs → Token Embeddings

An integer such as `8821` does not tell the model anything useful by itself. The model therefore converts each token ID into a vector of learned values called an embedding.

The easiest way to think about this is as a learned lookup table.

```text
Token ID
   ↓
Embedding table
   ↓
Vector representing that token
```

The embedding is learned during training. Tokens that are used in related contexts can develop related representations, although there is no rule saying that similar meanings must always produce nearby representations.

This is one of the places where modern language processing differs from older text representation methods.

### One Hot Encoding

One hot encoding represents each word using a vector in which one position identifies the word and all other positions are zero.

It tells us which word we have, but it does not tell us anything about the relationship between words.

For example, the representation of "cat" and "dog" would be just as unrelated as the representation of "cat" and "airplane".

### Bag of Words

Bag of Words counts the words that appear in a document.

This can be useful for simple text classification and search tasks, but it largely throws away word order.

For example:

```text
dog bites man
man bites dog
```

would contain the same words with the same counts.

The two sentences have very different meanings, but Bag of Words cannot represent that difference.

### TF IDF

TF IDF improves on simple word counting by giving more importance to words that are distinctive within a collection of documents.

It is still based on word occurrence rather than a learned contextual representation. It does not naturally capture the changing meaning of a word based on its surrounding text.

### Word2Vec, GloVe, and FastText

These methods introduced a major improvement because words were represented using dense learned vectors.

Instead of simply saying that two words are different, the representation could capture useful relationships learned from how words appear in text.

However, these older embeddings are static. A word normally receives the same learned representation regardless of the sentence in which it appears.

For example:

```text
I sat beside the river bank.

I deposited money in the bank.
```

A traditional static embedding gives "bank" one main representation.

Transformer models take a different approach. The initial token representation is only the starting point. The representation is changed as the token interacts with the surrounding context.

## 4. Adding Information About Position

Knowing which tokens are present is not enough. The model also needs information about their order.

Consider:

```text
The dog chased the cat.

The cat chased the dog.
```

The same words are present, but their order changes the meaning.

The original Transformer did not use recurrence to process one word after another. It processed the sequence using attention and therefore needed a way to provide information about token positions. The original Transformer added positional information to the token representations before processing them through the model.

Different transformer models have used different approaches.

The original Transformer used fixed sine and cosine positional encodings.

BERT used learned positional embeddings.

GPT 2 and GPT 3 also used learned positional embeddings rather than RoPE.

Later models introduced other approaches. RoPE, or Rotary Position Embedding, is one important example. Rather than simply adding a separate position vector to every token representation, RoPE incorporates positional information into the attention calculation by rotating parts of the representations according to their positions.

The important point is that the positional method is not the same across all transformer models. The model needs some way to distinguish the position and ordering of tokens, but the exact mechanism depends on the architecture.

## 5. Transformer Layers

The token representations now enter the main body of the transformer.

This is where the model repeatedly allows information from different parts of the sequence to interact and transforms those representations into richer ones.

It is common to describe this simply as self attention, but a transformer layer is more than attention alone.

A typical transformer layer contains attention, a feed forward network, residual connections, and normalization. The exact arrangement varies between architectures.

The original Transformer used layers containing multi head self attention followed by a position wise feed forward network, with residual connections and normalization around these components.

### Self Attention

Self attention allows a token to consider other tokens in the same sequence when building its current representation.

Consider:

```text
The laptop overheated because its fan broke.
```

When processing "its", information from other parts of the sentence can influence the representation of that token. The model can learn relationships between words even when those words are separated by several other tokens.

This is much more flexible than older representations such as TF IDF or static word embeddings because the representation of a token can change according to its context.

It is important, however, not to describe attention as if it were a small human reasoning process happening inside each word. Attention is a mechanism for moving and combining information between token representations. Useful linguistic behavior emerges from the entire trained network, not from attention alone.

### Multiple Attention Heads

Modern transformers normally use multiple attention heads.

Each head can learn to focus on different relationships within the sequence. One may become useful for certain grammatical relationships, another may capture other dependencies, and another may behave differently again.

The model does not receive labels telling each head what type of relationship to learn. These patterns develop during training.

### Feed Forward Network

Attention allows information to be exchanged between positions, but that is not the only computation performed by a transformer layer.

After attention, a feed forward network further transforms the representation at each position.

This component is important because a transformer layer is not simply a system that copies information from one word to another. It repeatedly transforms the information it has received.

This attention and transformation process is repeated across many layers.

## 6. Contextualized Representations

As the representations pass through the transformer layers, they become increasingly dependent on their surrounding context.

This is one of the most important differences between static word embeddings and transformer representations.

Consider the word "bank":

```text
I sat beside the river bank.

I deposited money at the bank.
```

The token is the same, but the surrounding words are different.

After processing the context, the representation associated with "bank" can therefore be different in the two sentences.

This is why transformer representations are often called contextualized representations.

The exact amount of context available depends on the architecture.

A bidirectional encoder such as BERT can use information from both sides of a token when producing its representation.

A decoder only language model such as GPT uses causal attention during generation. A token cannot look ahead at tokens that have not yet been generated. Its representation is therefore based on the information available up to that point.

This distinction matters because it is not accurate to say that every transformer token always sees the entire sentence.

## 7. From Contextualized Representations to Output

At this point, there is no single universal next step. What happens next depends on what the model was designed and trained to do.

Some transformer models are designed to produce useful representations of text. Others are designed to predict tokens. Encoder decoder models can use one sequence to help generate another.

### Text Embedding

For an embedding model, the contextualized token representations can be combined into a single representation of a sentence, paragraph, or document.

One common approach is pooling, where information from the token representations is combined into one fixed size representation.

Different models use different strategies. Some use the representation of a special token. Others average token representations or use another learned or predefined method.

Sentence BERT, for example, was specifically designed to produce sentence embeddings that can be efficiently compared for semantic similarity.

These embeddings are useful for tasks such as:

1. Semantic search
2. Retrieval augmented generation
3. Document clustering
4. Duplicate detection
5. Recommendation
6. Text classification

Two pieces of text can then be compared using a similarity measure such as cosine similarity.

The important distinction is that an embedding model is trying to produce a useful representation of the text. It is not necessarily trying to write the next word.

### Next Token Prediction

Generative language models take a different route.

Instead of reducing the entire input to one sentence vector, the model uses the representations produced by the transformer to predict the next token.

For example:

```text
The weather is
```

The model may assign high probability to tokens such as:

```text
good
cold
beautiful
sunny
```

The model then selects a token according to its generation strategy.

Suppose it selects:

```text
The weather is beautiful
```

That new token becomes part of the sequence, and the model predicts another token.

This continues until the model reaches an appropriate stopping condition.

The original Transformer already used this autoregressive idea in its decoder. The decoder generated one output element at a time while using previously generated elements as additional input.

Modern decoder only language models follow the same broad principle for text generation.

### Efficient Generation

A simple explanation might say that the model processes the entire sequence again every time a new token is produced.

That is useful for understanding the basic idea, but modern implementations use caching to make generation more efficient.

During generation, the model can store information from previous tokens, commonly through a key value cache. This allows it to avoid recomputing certain information that has already been produced.

Therefore, generation is conceptually sequential, but the actual implementation is optimized to avoid unnecessary computation.

## 8. The Main Idea

The complete process can be understood as a sequence of transformations:

```text
Text
 ↓
Tokens
 ↓
Token IDs
 ↓
Token embeddings
 ↓
Positional information
 ↓
Transformer layers
 ↓
Contextualized representations
 ↓
Output
```

For an embedding model, the contextualized representations can be combined into a representation of the text.

For a generative language model, those representations are used to predict the next token. The predicted token is added to the sequence, and the model continues predicting subsequent tokens until generation stops.

The important thing is that these are not rigid stages shared identically by every transformer model. They are the main concepts needed to understand how text moves through modern transformer based language systems.

The tokenizer can differ. The positional method can differ. The transformer layer design can differ. Some models are encoders, some are decoders, and some combine both.

The central idea remains simple.

Text is converted into tokens. Tokens are mapped to IDs and then to learned representations. Positional information helps the model understand order. Transformer layers allow information from different parts of the input to interact and repeatedly transform those representations. The resulting contextualized representations can then be used for different purposes, including representing text or predicting the next token.

For a generative language model, the final response is produced one token at a time. The model predicts a token, adds it to the sequence, and continues until generation stops.

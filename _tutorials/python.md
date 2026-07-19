---
layout: default
title: "Python for NLP"
section_name: "Reference"
date: 2026-07-19
---

## SECTION 1 — Python Quick Refresher

Before diving into NLP, let's refresh the Python fundamentals you'll use constantly.

### 1.1 Variables & Data Types

Python is dynamically typed — you don't declare types explicitly.

```bash
# Basic types
name     = "Alice"          # str
count    = 42               # int
score    = 0.95             # float
is_valid = True             # bool

# Check type
print(type(name))              # <class 'str'>
print(isinstance(count, int))  # True
```

### 1.2 Strings — The Core of NLP

Almost all NLP work revolves around strings. Master these operations:

```bash
text = "Natural Language Processing is fascinating!"

# Essential string methods
print(text.lower())              # "natural language processing..."
print(text.upper())              # "NATURAL LANGUAGE..."
print(text.strip())              # removes leading/trailing whitespace
print(text.replace("!", "."))    # substitute characters
print(text.split())              # ["Natural", "Language", ...]
print(len(text))                 # 44

# Slicing
print(text[0:7])                 # "Natural"
print(text[-14:])                # "fascinating!"

# Check content
print("NLP" in text)             # False (case-sensitive)
print("Language" in text)        # True

# f-strings
word = "language"
print(f"The word '{word}' has {len(word)} characters.")
```

> Note: In NLP, `.lower()` and `.strip()` are called on almost every piece of text before processing.

### 1.3 Lists

Lists store sequences — tokens, sentences, and labels all live in lists.

```bash
tokens = ["I", "love", "NLP", "!"]

# Access
print(tokens[0])        # "I"
print(tokens[-1])       # "!"
print(tokens[1:3])      # ["love", "NLP"]

# Modify
tokens.append("wow")    # add to end
tokens.remove("!")      # remove by value
tokens.pop(0)           # remove by index, returns the item

# List comprehension — used constantly in NLP
words = ["Hello", "World", "NLP"]
lower_words = [w.lower() for w in words]
# → ["hello", "world", "nlp"]

# Filter with comprehension
long_words = [w for w in words if len(w) > 4]
# → ["Hello", "World"]
```

### 1.4 Dictionaries

Dictionaries map keys to values — perfect for word frequencies and vocabularies.

```bash
freq = {"the": 10, "cat": 3, "sat": 2}

# Access
print(freq["the"])          # 10
print(freq.get("dog", 0))   # 0  (safe — no KeyError)

# Add / update
freq["mat"] = 1
freq["cat"] += 1            # now 4

# Iterate
for word, count in freq.items():
    print(f"{word}: {count}")

# Build frequency dict from a list
words = ["cat", "dog", "cat", "bird", "dog", "cat"]
freq = {}
for w in words:
    freq[w] = freq.get(w, 0) + 1
# → {"cat": 3, "dog": 2, "bird": 1}
```

### 1.5 Functions

```bash
def clean_text(text, lowercase=True):
    """Clean raw text for NLP processing."""
    text = text.strip()
    if lowercase:
        text = text.lower()
    return text

# Call it
result = clean_text("  Hello World!  ")
print(result)   # "hello world!"

# Lambda — quick one-liner function
strip_fn = lambda s: s.strip().lower()
print(strip_fn("  NLP  "))   # "nlp"
```

### 1.6 Loops & Conditions

```bash
sentences = ["I love NLP.", "Python is great.", "Let's learn!"]

# for loop with index
for i, sent in enumerate(sentences):
    print(f"Sentence {i+1}: {sent}")

# while loop
count = 0
while count < 3:
    print(count)
    count += 1

# Conditionals
text = "I love cats"
if "love" in text:
    print("Positive sentiment detected!")
elif "hate" in text:
    print("Negative sentiment detected!")
else:
    print("Neutral")
```

---

## SECTION 2 — Essential Libraries for NLP

Install these once, use them in every project:

```bash
# Run in your terminal
pip install numpy pandas matplotlib
pip install nltk spacy
pip install scikit-learn
pip install transformers
```

### 2.1 NumPy — Numbers & Arrays

NLP models work with numeric arrays (word vectors, matrices). NumPy is the foundation.

```python
import numpy as np

# Create arrays
arr    = np.array([1, 2, 3, 4, 5])
matrix = np.zeros((3, 4))     # 3×4 matrix of zeros

# Word embedding: each word → vector of numbers
word_vector = np.array([0.25, -0.5, 0.8, 0.1])
print(word_vector.shape)      # (4,)

# Math operations
print(np.mean(word_vector))   # average
print(np.dot([1,0,0], [1,0,0]))  # dot product → 1.0

# Cosine similarity — how similar are two word vectors?
def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

v1 = np.array([0.9, 0.1])
v2 = np.array([0.8, 0.2])
print(cosine_sim(v1, v2))     # close to 1.0 = very similar
```

### 2.2 Pandas — Loading & Handling Text Data

```python
import pandas as pd

# Load a CSV dataset
df = pd.read_csv("reviews.csv")
print(df.head())           # first 5 rows
print(df.shape)            # (rows, columns)

# Text column operations
df["clean"] = df["review"].str.lower().str.strip()

# Filter rows
positive = df[df["label"] == "positive"]

# Count labels
print(df["label"].value_counts())

# Build a DataFrame manually
data = {"text": ["I love it", "Terrible!"],
        "label": ["pos", "neg"]}
df = pd.DataFrame(data)
```

### 2.3 Matplotlib — Visualising Text Data

```python
import matplotlib.pyplot as plt
from collections import Counter

text  = "the cat sat on the mat the cat is fat"
freq  = Counter(text.split())

top5   = freq.most_common(5)
labels, counts = zip(*top5)

plt.bar(labels, counts, color="steelblue")
plt.title("Top 5 Word Frequencies")
plt.xlabel("Word")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("word_freq.png")
plt.show()
```

---

## SECTION 3 — Core NLP Concepts & Techniques

### 3.1 Tokenization

Splitting raw text into individual units (tokens). This is always step one.

```python
import nltk
nltk.download("punkt_tab")   # run once

from nltk.tokenize import word_tokenize, sent_tokenize

# Word tokenization
text   = "I can't believe NLP is this fun!"
tokens = word_tokenize(text)
# → ["I", "ca", "n't", "believe", "NLP", "is", "this", "fun", "!"]

# Sentence tokenization
para  = "Hello world. How are you? I am fine."
sents = sent_tokenize(para)
# → ["Hello world.", "How are you?", "I am fine."]

# Quick split (whitespace only)
tokens = text.split()
```

### 3.2 Stopword Removal

Stopwords are common words (the, a, is) that carry little meaning. We remove them to focus on content words.

```python
from nltk.corpus import stopwords
nltk.download("stopwords")

text     = "This is a very simple example of NLP processing"
tokens   = word_tokenize(text.lower())
sw       = set(stopwords.words("english"))

filtered = [w for w in tokens if w not in sw]
print(filtered)
# → ["simple", "example", "nlp", "processing"]
```

> Note: Always lowercase before checking stopwords — the list is entirely lowercase.

### 3.3 Stemming vs Lemmatization

Both reduce words to their base form. Lemmatization is more accurate; stemming is faster.

```python
# STEMMING — fast, crude  (flies → fli)
from nltk.stem import PorterStemmer
stemmer = PorterStemmer()

words = ["running", "flies", "studies", "easily"]
for w in words:
    print(f"{w:12s} → {stemmer.stem(w)}")
# running      → run
# flies        → fli   ← crude!
# studies      → studi ← crude!
# easily       → easili ← crude!

# LEMMATIZATION — slower, correct  (flies → fly)
from nltk.stem import WordNetLemmatizer
nltk.download("wordnet")
lem = WordNetLemmatizer()

for w in words:
    print(f"{w:12s} → {lem.lemmatize(w, pos='v')}")
# running      → run
# flies        → fly
# studies      → study
# easily       → easily   ← adverbs often don't change under pos='v'
```

### 3.4 Part-of-Speech (POS) Tagging

Labels each word as noun, verb, adjective, etc. Useful for filtering or grammar analysis.

```python
nltk.download("averaged_perceptron_tagger_eng")

text     = "The quick brown fox jumps over the lazy dog"
tokens   = word_tokenize(text)
pos_tags = nltk.pos_tag(tokens)

for word, tag in pos_tags:
    print(f"{word:10s} → {tag}")

# Common tags:
# NN  = Noun       VB  = Verb      JJ  = Adjective
# RB  = Adverb     PRP = Pronoun   DT  = Determiner
# VBZ = Verb (3rd person singular present)
```

> Note: NLTK occasionally renames its downloadable resources between versions (e.g. `punkt` → `punkt_tab`, `averaged_perceptron_tagger` → `averaged_perceptron_tagger_eng`). If a `nltk.download()` call fails, the error message will tell you the exact resource id it's looking for — just download that.

### 3.5 Named Entity Recognition (NER) with spaCy

Identifies real-world entities: people, places, organisations, dates.

```python
import spacy
# First time only: python -m spacy download en_core_web_sm

nlp = spacy.load("en_core_web_sm")
doc = nlp("Barack Obama was born in Hawaii in 1961.")

for ent in doc.ents:
    print(f"{ent.text:20s} → {ent.label_}")
# Barack Obama        → PERSON
# Hawaii              → GPE    (Geopolitical entity)
# 1961                → DATE

# spaCy does tokenization + POS + NER in one call:
for token in doc:
    print(f"{token.text:10s}  pos={token.pos_:6s}  dep={token.dep_}")
```

---

## SECTION 4 — Full Preprocessing Pipeline

This is the standard pipeline you run on raw text before feeding it to any model:

```python
import re, nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

lem  = WordNetLemmatizer()
stop = set(stopwords.words("english"))

def preprocess(text):
    text   = text.lower()                          # 1. lowercase
    text   = re.sub(r"http\S+|www\S+", "", text)   # 2. remove URLs
    text   = re.sub(r"[^a-z\s]", "", text)         # 3. remove punctuation/digits
    tokens = word_tokenize(text)                   # 4. tokenize
    tokens = [t for t in tokens if t not in stop]  # 5. remove stopwords
    tokens = [lem.lemmatize(t) for t in tokens]    # 6. lemmatize
    tokens = [t for t in tokens if len(t) > 2]     # 7. drop short tokens
    return tokens

# Test
raw = "I'm running 3 experiments on NLP! Check http://nlp.io for more."
print(preprocess(raw))
# → ["running", "experiment", "nlp", "check"]
```

> Note: Save this as `utils.py` and import it across all your NLP projects.

### 4.1 Regular Expressions for Text Cleaning

Regex is your power tool for finding and replacing patterns in text.

```python
import re

text = "Call 01711-234567 or email hello@nlp.com by 2024-01-15"

# Find phone numbers
phones = re.findall(r"\d{5}-\d{6}", text)
print(phones)   # ["01711-234567"]

# Find emails
emails = re.findall(r"[\w.-]+@[\w.-]+\.[a-z]+", text)
print(emails)   # ["hello@nlp.com"]

# Find dates
dates = re.findall(r"\d{4}-\d{2}-\d{2}", text)
print(dates)    # ["2024-01-15"]

# Replace numbers with placeholder
clean = re.sub(r"\d+", "NUM", "I have 3 cats and 12 dogs")
print(clean)    # "I have NUM cats and NUM dogs"

# Useful patterns quick ref:
# \s+      one or more whitespace
# \w+      one or more word characters  (a-z, 0-9, _)
# [^a-z]   anything that is NOT a–z
# .*       any characters (greedy)
```

---

## SECTION 5 — Converting Text to Numbers

ML models can't read text — they read numbers. Here's how to convert:

### 5.1 Bag of Words (BoW)

Each document becomes a vector of word counts. Simple but effective.

```python
from sklearn.feature_extraction.text import CountVectorizer

corpus = [
    "I love NLP",
    "NLP is amazing",
    "I love machine learning",
]

vec = CountVectorizer()
X   = vec.fit_transform(corpus)

print(vec.get_feature_names_out())
# ["amazing", "is", "learning", "love", "machine", "nlp"]

print(X.toarray())
# [[0, 0, 0, 1, 0, 1],   "I love NLP"
#  [1, 1, 0, 0, 0, 1],   "NLP is amazing"
#  [0, 0, 1, 1, 1, 0]]   "I love machine learning"
```

### 5.2 TF-IDF

Gives higher weight to words unique to a document and lower weight to words common across all documents. Better than raw counts.

```python
from sklearn.feature_extraction.text import TfidfVectorizer

corpus = [
    "I love NLP and natural language",
    "NLP is amazing and powerful",
    "I love machine learning and AI",
]

tfidf = TfidfVectorizer()
X     = tfidf.fit_transform(corpus)

# "and" / "I" → low score (appear everywhere)
# "NLP" / "machine" → high score (more unique)

import pandas as pd
df = pd.DataFrame(X.toarray(), columns=tfidf.get_feature_names_out())
print(df.round(2))
```

> Note: TF-IDF is still very effective for text classification. Always try it as a baseline first.

### 5.3 Word Embeddings with spaCy

Dense vectors where similar words are close together in vector space.

```python
# Needs medium model: python -m spacy download en_core_web_md
import spacy, numpy as np

nlp = spacy.load("en_core_web_md")

# Each word → 300-dimensional vector
word = nlp("king")
print(word.vector.shape)      # (300,)

# Cosine similarity between words
def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

king  = nlp("king").vector
queen = nlp("queen").vector
man   = nlp("man").vector

print(cosine(king, queen))    # ~0.77  similar
print(cosine(king, man))      # ~0.68  somewhat similar

# Sentence similarity
doc1 = nlp("I love programming")
doc2 = nlp("I enjoy coding")
print(doc1.similarity(doc2))  # ~0.80
```

---

## SECTION 6 — Common NLP Tasks

### 6.1 Sentiment Analysis (Rule-based — VADER)

```python
from nltk.sentiment import SentimentIntensityAnalyzer
nltk.download("vader_lexicon")

sia = SentimentIntensityAnalyzer()

reviews = [
    "This is absolutely amazing!",
    "Terrible experience, waste of time.",
    "It was okay, nothing special.",
]

for review in reviews:
    scores = sia.polarity_scores(review)
    # compound: +1 = very positive, -1 = very negative
    if scores["compound"] >= 0.05:
        label = "POSITIVE"
    elif scores["compound"] <= -0.05:
        label = "NEGATIVE"
    else:
        label = "NEUTRAL"
    print(f"{label:10s}  {review}")
```

### 6.2 Text Classification with scikit-learn

Train a model to assign predefined categories to text.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

texts  = ["I love this product", "Terrible quality",
          "Great service!", "Worst purchase ever",
          "Highly recommend", "Do not buy this"]
labels = ["pos", "neg", "pos", "neg", "pos", "neg"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.3, random_state=42)

# Vectorize
vec        = TfidfVectorizer()
X_train_v  = vec.fit_transform(X_train)
X_test_v   = vec.transform(X_test)

# Train
model = MultinomialNB()
model.fit(X_train_v, y_train)

# Evaluate
y_pred = model.predict(X_test_v)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(classification_report(y_test, y_pred))

# Predict new text
new_vec = vec.transform(["This is fantastic!"])
print(model.predict(new_vec))   # ["pos"]
```

> Note: This toy example has only 6 samples — real projects need far more data for meaningful accuracy. It's here to show the workflow, not to be judged on its score.

### 6.3 Text Similarity

```python
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

docs = [
    "Python is great for NLP",
    "NLP with Python is wonderful",
    "I love football and sports",
]

X   = TfidfVectorizer().fit_transform(docs)
sim = cosine_similarity(X)
print(sim.round(2))
# [[1.   0.65 0.  ]
#  [0.65 1.   0.  ]   ← docs 0 and 1 share 65% similarity
#  [0.   0.   1.  ]]  ← doc 2 shares nothing with 0 or 1
```

---

## SECTION 7 — Modern NLP: Transformers

Pre-trained models from Hugging Face give you state-of-the-art results with very few lines of code.

```bash
pip install transformers
# Models are downloaded automatically on first use
```

### 7.1 Sentiment Analysis

```python
from transformers import pipeline

clf = pipeline("sentiment-analysis")

results = clf([
    "I absolutely love this!",
    "This is the worst thing ever.",
])

for r in results:
    print(f"Label: {r['label']:10s}  Score: {r['score']:.4f}")
# Label: POSITIVE    Score: 0.9998
# Label: NEGATIVE    Score: 0.9997
```

### 7.2 Named Entity Recognition

```python
ner = pipeline("ner", grouped_entities=True)

text     = "Elon Musk founded SpaceX in California in 2002."
entities = ner(text)

for ent in entities:
    print(f"{ent['word']:15s} → {ent['entity_group']}")
# Elon Musk      → PER
# SpaceX         → ORG
# California     → LOC
```

### 7.3 Question Answering

```python
qa = pipeline("question-answering")

context = """
    Python was created by Guido van Rossum and released in 1991.
    It is widely used for web development, data science, and NLP.
"""

questions = ["Who created Python?", "When was Python released?"]

for q in questions:
    ans = qa(question=q, context=context)
    print(f"Q: {q}")
    print(f"A: {ans['answer']}  (confidence: {ans['score']:.2f})")
    print()
```

### 7.4 Text Generation

```python
gen = pipeline("text-generation", model="gpt2")

result = gen(
    "Natural Language Processing is",
    max_length=50,
    num_return_sequences=1
)
print(result[0]["generated_text"])
```

> Note: Hugging Face pipelines handle tokenization, model inference, and decoding for you. Start here before building custom training loops. The first call to any pipeline downloads the model weights (can be several hundred MB), so it's slow once and fast after that.

---

## SECTION 8 — Quick Reference Cheat Sheet

### All Imports at a Glance

```python
# Data & Math
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import re
from collections import Counter

# NLTK
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer, PorterStemmer
from nltk.sentiment import SentimentIntensityAnalyzer

# spaCy
import spacy
nlp = spacy.load("en_core_web_sm")

# scikit-learn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.metrics.pairwise import cosine_similarity

# Transformers
from transformers import pipeline
```

### NLTK One-Time Downloads

```python
import nltk
nltk.download("punkt_tab")                       # tokenization
nltk.download("stopwords")                       # stopword list
nltk.download("wordnet")                         # lemmatization
nltk.download("averaged_perceptron_tagger_eng")  # POS tagging
nltk.download("vader_lexicon")                   # sentiment
nltk.download("omw-1.4")                         # multilingual wordnet
```

### Task → Tool Reference

| Task | Tool / Method |
|---|---|
| Tokenization | `nltk.word_tokenize` / `spacy` |
| Stopword Removal | `nltk.corpus.stopwords` |
| Stemming | `nltk.stem.PorterStemmer` |
| Lemmatization | `nltk.stem.WordNetLemmatizer` |
| POS Tagging | `nltk.pos_tag` / `spacy` |
| Named Entity Recognition | `spacy` / `pipeline("ner")` |
| Sentiment Analysis | VADER / `pipeline("sentiment-analysis")` |
| Text Vectorization | `TfidfVectorizer` / `CountVectorizer` |
| Text Classification | `MultinomialNB` / `SVC` (sklearn) |
| Text Similarity | `cosine_similarity` (sklearn) |
| Word Embeddings | `spacy en_core_web_md` / `gensim` |
| Question Answering | `pipeline("question-answering")` |
| Text Generation | `pipeline("text-generation", model="gpt2")` |

### The 10-Line NLP Pipeline

```python
import re, nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

def nlp_pipeline(text):
    text   = re.sub(r"[^a-z\s]", "", text.lower())
    tokens = word_tokenize(text)
    stop   = set(stopwords.words("english"))
    tokens = [t for t in tokens if t not in stop and len(t) > 2]
    lem    = WordNetLemmatizer()
    return [lem.lemmatize(t) for t in tokens]

print(nlp_pipeline("Running experiments with NLP models quickly!"))
# → ["running", "experiment", "nlp", "model", "quickly"]
```
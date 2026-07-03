---
title: "Fine-Tuning mT5 for Bangla Summarization"
description: "A step-by-step walkthrough of how I fine-tuned mT5-small on XL-Sum Bangla."
date: 2026-06-10
---

This tutorial walks through the process I used to fine-tune `mT5-small` on the Bangla subset of the XL-Sum dataset for abstractive summarization.

## 1. Setup

Install the required libraries:

```bash
pip install transformers datasets evaluate rouge_score sentencepiece
```

## 2. Load the dataset

```python
from datasets import load_dataset

dataset = load_dataset("csebuetnlp/xlsum", "bengali")
```

## 3. Tokenize

Use the mT5 tokenizer with a reasonable max input/output length for Bangla news articles — I used 512 tokens for input and 84 for the summary target.

## 4. Fine-tune

Standard Seq2Seq fine-tuning with the Hugging Face `Trainer` API works well here. Key hyperparameters that mattered most for me:

- Learning rate: `3e-4`
- Batch size: as large as GPU memory allowed, with gradient accumulation
- A few epochs were enough to see solid ROUGE improvements

## 5. Deploy

I deployed the final model on Hugging Face Spaces with a simple Gradio interface for interactive testing.

That's the high-level flow — I'll follow up with a deeper post on evaluation metrics for Bangla summarization specifically.